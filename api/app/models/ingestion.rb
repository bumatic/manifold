require "colorized_string"
require "stringio"

# Connects texts to resources that were sources for text sections during ingestion
class Ingestion < ApplicationRecord

  # Concerns
  include Authority::Abilities
  include Attachments
  include TrackedCreator
  include AASM

  attr_writer :log_buffer

  # Associations
  belongs_to :text, optional: true
  belongs_to :project

  # Attachments
  manifold_has_attached_file :source, :ingestion

  # Validations
  validates :ingestion_type, presence: true
  validates :source, presence: true, if: :file_based_ingestion?
  validates :external_source_url, presence: true, unless: :file_based_ingestion?

  # rubocop:disable Metrics/BlockLength
  aasm column: "state" do
    state :sleeping, initial: true
    state :analyzing
    state :analyzed
    state :processing
    state :finished

    event :analyze, after: :begin_analysis do
      transitions from: :sleeping, to: :analyzing, guard: :ingestable?
    end

    event :analysis_success do
      transitions from: :analyzing, to: :analyzed
    end

    event :analysis_failure do
      transitions from: :analyzing, to: :sleeping
    end

    event :process, after: :begin_processing do
      transitions from: :analyzed, to: :processing
    end

    event :processing_success do
      transitions from: :processing, to: :finished
    end

    event :processing_failure do
      transitions from: :processing, to: :finished
    end

    event :reset, after: :reset_strategy do
      transitions from: :analyzing, to: :sleeping
      transitions from: :analyzed, to: :sleeping
      transitions from: :processing, to: :sleeping
      transitions from: :finished, to: :sleeping
    end
  end

  # rubocop:enable Metrics/BlockLength
  %w(DEBUG INFO WARN ERROR FATAL UNKNOWN).each do |severity|
    class_eval <<-EOT, __FILE__, __LINE__ + 1
      def #{severity.downcase}(message = nil, progname = nil, &block)
        add("#{severity}", ColorizedString.new(message).uncolorize, progname, &block)
      end
    EOT
  end

  before_save :commit_log
  before_update :commit_log

  def reset_strategy
    self.strategy = nil
  end

  def file_based_ingestion?
    return external_source_url.blank? if ingestion_type == "epub"
    ingestion_type != "googledoc"
  end

  def ingestable?
    valid?
  end

  def strategy_label
    return nil if strategy.blank?
    klass = strategy.constantize
    klass.respond_to?(:label) ? klass.label : klass.name
  end

  def log_buffer
    @log_buffer ||= []
  end

  def add(severity, message = nil, _progname = nil)
    line = [severity, message]
    log_buffer << line
    return if severity == "DEBUG"
    IngestionChannel.broadcast_to self, type: "log", payload: line
  end

  def clear_log
    self.log = []
  end

  def commit_log
    self.log = log_buffer
    self.log_buffer = []
  end

  def ingestion_source
    return source.path if file_based_ingestion?
    external_source_url
  end

  def begin_analysis
    Ingestor.logger = self
    begin
      self.strategy = Ingestor.determine_strategy(ingestion_source, creator)
      analysis_success
    rescue => e
      error("Analysis failed: #{e}")
      analysis_failure
      return
    end
  end

  # rubocop:disable Metrics/AbcSize
  # rubocop:disable Metrics/MethodLength
  def begin_processing(processing_user = nil)
    # Announce the new state of the ingestion.
    serialization_options = { scope: processing_user }
    serialization = ActiveModelSerializers::SerializableResource.new(
      self,
      serialization_options
    )
    IngestionChannel.broadcast_to self, type: "entity", payload: serialization

    Ingestor.logger = self
    begin
      if text
        Ingestor.ingest_update(ingestion_source, creator, text)
      else
        self.text = Ingestor.ingest_new(ingestion_source, creator)
      end
      text.project = project
      text.save
      processing_success
    rescue => e
      handle_ingestion_exception(e)
    end
    Ingestor.reset_logger
  end
  # rubocop:enable Metrics/AbcSize
  # rubocop:enable Metrics/MethodLength

  private

  def handle_ingestion_exception(error)
    error("Processing failed: #{error}")
    if Rails.env.development?
      Rails.backtrace_cleaner.clean(error.backtrace).each do |line|
        error(line)
      end
    end
    processing_failure
  end

end
