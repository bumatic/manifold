Paperclip.options[:content_type_mappings] = {
  ncx: ["text/html", "application/xml"],
  xhtml: "text/html",
  css: ["text/x-c", "text/css"],
  ttf: ["application/x-font-ttf", "application/x-font-truetype"],
  webm: ["video/webm", "audio/webm"]
}

# We need to accept dataURIs.
# See https://github.com/thoughtbot/paperclip/pull/2435 for background on this change.
Paperclip::DataUriAdapter.register
Paperclip::UriAdapter.register

Paperclip.interpolates :uuid_partition do |attachment, _style|
  id = attachment.instance.id
  return id unless id.is_a? String
  id[0..2].scan(/\w/).join("/".freeze)
end

# rubocop:disable Metrics/LineLength
Paperclip::Attachment.default_options.update(
  path: ":rails_root/public/system/:class/:attachment/:uuid_partition/:style-:hash.:extension",
  hash_secret: ENV["RAILS_SECRET_KEY"],
  url: "/system/:class/:attachment/:uuid_partition/:style-:hash.:extension",
  include_updated_timestamp: false,
  default_url: ""
)
# rubocop:enable Metrics/LineLength

require "paperclip/media_type_spoof_detector"

module Paperclip
  # Monkey patches paper clip to disable spoofed file detection, which breaks on UAT.
  class MediaTypeSpoofDetector
    def spoofed?
      false
    end
  end
end
