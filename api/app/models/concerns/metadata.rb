# Helpers for hash attributes
# rubocop:disable Rails/ReadWriteAttribute
module Metadata
  extend ActiveSupport::Concern

  def validate_metadata(properties)
    write_attribute(:metadata, metadata.slice(*properties))
  end

  def metadata=(value)
    base = metadata || {}
    new = base.merge(value)
    write_attribute(:metadata, new)
  end

  class_methods do
    def metadata_properties
      @metadata_properties
    end

    def with_metadata(properties)
      attr_reader :metadata_properties

      @metadata_properties = properties

      after_initialize do
        @metadata_properties = properties
      end

      before_save do
        validate_metadata(properties)
      end
    end
  end
end
# rubocop:enable Rails/ReadWriteAttribute
