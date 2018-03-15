class ResourceAuthorizer < ProjectChildAuthorizer
  def updatable_by?(user)
    ProjectAuthorizer.new(resource.project).resource_metadata_updatable_by?(user)
  end
end
