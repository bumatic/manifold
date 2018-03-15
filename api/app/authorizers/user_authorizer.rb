class UserAuthorizer < ApplicationAuthorizer

  def self.creatable_by?(user)
    return true unless user
    user.admin?
  end

  def self.updatable_by?(user)
    user.admin?
  end

  def self.readable_by?(user)
    user.admin?
  end

  def self.deletable_by?(user)
    user.admin?
  end

  def updatable_by?(user)
    resource == user || user.admin?
  end

  def readable_by?(user)
    resource == user || user.admin?
  end

end
