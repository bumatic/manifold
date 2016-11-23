# A value object representing a text's title.
class TextTitle < ActiveRecord::Base

  # Constants
  KIND_MAIN = "main".freeze
  KIND_ACRONYM = "acronym".freeze
  KIND_ABBREVIATED = "abbreviated".freeze
  KIND_ALTERNATIVE = "alternative".freeze
  KIND_EXPANDED = "expanded".freeze
  KIND_FORMER = "former".freeze
  KIND_ALTERNATIVE_COVER = "alternative_cover".freeze
  KIND_ALTERNATIVE_BACK = "alternative_back".freeze
  KIND_TRANSLATED = "translated".freeze
  KIND_SUBTITLE = "subtitle".freeze
  KIND_SHORT = "short".freeze
  KIND_COLLECTION = "collection".freeze
  KIND_EDITION = "edition".freeze
  ALLOWED_KINDS = [KIND_MAIN,
                   KIND_ACRONYM,
                   KIND_ABBREVIATED,
                   KIND_ALTERNATIVE,
                   KIND_ALTERNATIVE_COVER,
                   KIND_ALTERNATIVE_BACK,
                   KIND_EXPANDED,
                   KIND_FORMER,
                   KIND_TRANSLATED,
                   KIND_SUBTITLE,
                   KIND_SHORT,
                   KIND_COLLECTION,
                   KIND_EDITION].freeze

  # Authority
  include Authority::Abilities

  # Associations
  belongs_to :text

  # Validation
  validates :value, presence: true
  validates :kind, inclusion: { in: ALLOWED_KINDS }

end
