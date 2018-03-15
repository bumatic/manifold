class MakerAuthorizer < ApplicationAuthorizer
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
    user.admin? ||
      user.editor? ||
      editor_of_maker_project?(user)
  end

  def readable_by?(user)
    user.admin? ||
      user.editor? ||
      editor_of_maker_project?(user)
  end

  def updatable_by?(user)
    user.admin? ||
      user.editor? ||
      editor_of_maker_project?(user)
  end

  def deletable_by?(user)
    user.admin? ||
      user.editor? ||
      editor_of_maker_project?(user)
  end

  def editor_of_maker_project?(user)
    resource.projects.any? do |project|
      user.project_editor_of? project
    end
  end
end
