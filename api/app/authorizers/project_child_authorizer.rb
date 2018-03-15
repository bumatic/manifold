class ProjectChildAuthorizer < ApplicationAuthorizer
  def self.updatable_by?(user)
    user.kind != Role::ROLE_READER
  end

  def self.creatable_by?(user)
    user.kind != Role::ROLE_READER
  end

  def self.readable_by?(user)
    user.kind != Role::ROLE_READER
  end

  def self.deletable_by?(user)
    user.kind != Role::ROLE_READER
  end

  def creatable_by?(user)
    user.can_update? resource.project
  end

  def readable_by?(user)
    user.admin? ||
      user.editor? ||
      user.marketeer? ||
      user.project_editor_of?(resource.project) ||
      user.project_resource_editor_of?(resource.project)
  end

  def updatable_by?(user)
    user.can_update? resource.project
  end

  def deletable_by?(user)
    user.can_delete? resource.project
  end
end
