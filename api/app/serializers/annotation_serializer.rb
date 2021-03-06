# Serializes an Annotation model
class AnnotationSerializer < ApplicationSerializer
  include Abilities
  meta(partial: false)

  has_one :creator
  attributes :created_at, :end_char, :end_node, :id, :start_char, :start_node,
             :text_section_id, :updated_at, :format, :subject, :abilities,
             :resource_id, :creator_id, :body, :private,
             :comments_count, :collection_id

end
