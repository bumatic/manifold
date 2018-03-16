class ProjectAuthorizer < ApplicationAuthorizer

  def self.updatable_by?(user)
    user.admin? || user.editor? || user.project_creator?
  end

  def self.creatable_by?(user)
    user.admin? || user.editor? || user.project_creator?
  end

  def self.readable_by?(_user)
    true
  end

  def self.deletable_by?(user)
    user.admin? || user.editor? || user.project_creator?
  end

  def creatable_by?(user)
    user.admin? || user.editor? || user.project_creator?
  end

  def updatable_by?(user)
    user.admin? ||
      user.editor? ||
      user.marketeer? ||
      user.project_editor_of?(resource)
  end

  def deletable_by?(user)
    user.admin? || user.editor? || user.project_editor_of?(resource)
  end

  def readable_by?(user)
    return true unless resource.draft?
    user.admin? ||
      user.editor? ||
      user.marketeer? ||
      user.project_editor_of?(resource) ||
      user.project_resource_editor_of?(resource)
  end

  def resource_metadata_updatable_by?(user)
    updatable_by?(user) || user.project_resource_editor_of?(resource)
  end

  def project_makers_updatable_by?(user)
    user.admin? || user.editor? || user.project_editor_of?(resource)
  end

end
