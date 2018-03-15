class MakerAuthorizer < ApplicationAuthorizer

  def self.creatable_by?(user)
    user.admin? || user.editor? || user.project_creator?
  end

  def self.updatable_by?(user)
    user.admin? || user.editor? || user.project_creator?
  end

  def self.readable_by?(_user)
    true
  end

  def self.deletable_by?(user)
    user.admin? || user.editor? || user.project_creator?
  end
end
