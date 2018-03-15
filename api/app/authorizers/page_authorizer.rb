class PageAuthorizer < ApplicationAuthorizer

  def self.updatable_by?(user)
    user.admin? ||
      user.editor? ||
      user.marketeer?
  end

  def self.creatable_by?(user)
    user.admin? ||
      user.editor? ||
      user.marketeer?
  end

  def self.readable_by?(_user)
    true
  end

  def self.deletable_by?(user)
    user.admin? ||
      user.editor? ||
      user.marketeer?
  end

  def readable_by?(_user)
    true
  end

end
