require "digest"
require "redcarpet"
require "metadown"

module Ingestor
  module Strategy
    module Markdown
      module Inspector
        # Inspects Markdown text sections
        class TextSection < ::Ingestor::Inspector::TextSectionInspector

          def initialize(section_path, ingestion, summary_path)
            @summary_path = summary_path
            @section_path = section_path
            @ingestion = ingestion
          end

          def source_identifier
            Digest::MD5.hexdigest(@section_path)
          end

          def name
            title = metadata_title || navigation_title || basename
            title.strip.delete("\\").delete("*")
          end

          def basename
            File.basename(@section_path, ".*")
          end

          def source_path
            @ingestion.derelativize_ingestion_path(@summary_path, @section_path)
          end

          def ingestion_source(text)
            text.ingestion_sources.find_by(source_path: source_path.to_s)
          end

          def source_body
            markdown = @ingestion.read(@section_path)
            markdown = remove_yaml_header(markdown)
            renderer = Redcarpet::Render::HTML.new
            redcarpet = Redcarpet::Markdown.new(
              renderer,
              fenced_code_blocks: true,
              footnotes: true,
              tables: true
            )
            markup = redcarpet.render(markdown)
            markup
          end

          def kind
            return ::TextSection::KIND_NAVIGATION if basename == "SUMMARY"
            ::TextSection::KIND_SECTION
          end

          protected

          def navigation_title
            @ingestion.readlines(@summary_path).each do |line|
              return line[/\[(.*?)\]/, 1] if line[/\((.*?)\)/, 1] == source_path.to_s
            end
            false
          end

          def metadata_title
            markdown = @ingestion.read(@section_path)
            data = Metadown.render(markdown)
            data.metadata["title"] ||= false
          end

          def remove_yaml_header(markdown)
            markdown.gsub(/\A---(.|\n)*?---/, "")
          end

        end
      end
    end
  end
end
