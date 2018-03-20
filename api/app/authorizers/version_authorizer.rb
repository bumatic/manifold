class VersionAuthorizer < ApplicationAuthorizer

  def self.readable_by?(user)
    user.admin? || user.editor?
  end

end
