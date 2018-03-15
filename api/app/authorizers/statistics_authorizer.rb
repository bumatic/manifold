class StatisticsAuthorizer < ApplicationAuthorizer

  def self.readable_by?(user)
    user.admin? ||
      user.editor? ||
      user.marketeer?
  end

end
