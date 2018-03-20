# Provides a serialization of a collection model.
class CollectionSerializer < ApplicationSerializer
  meta(partial: false)
  include Abilities

  attributes :id, :title, :title_formatted, :created_at, :description, :project_id,
             :resource_kinds, :resource_tags, :thumbnail_styles,
             :collection_resources_count, :slug, :abilities_for_user

  has_many :resources, serializer: ResourcePartialSerializer
  belongs_to :project

  def resource_tags
    object.resource_tags.sort
  end

end
