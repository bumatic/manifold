# Other authorizers should subclass this one
class ApplicationAuthorizer < Authority::Authorizer

  # Any class method from Authority::Authorizer that isn't overridden
  # will call its authorizer's default method.
  #
  # @param [Symbol] adjective; example: `:creatable`
  # @param [Object] user - whatever represents the current user in your app
  # @return [Boolean]
  def self.default(_adjective, _user)
    # 'Whitelist' strategy for security: anything not explicitly allowed is
    # considered forbidden.
    false
  end

  def self.authorizes_to_send_test_mail?(user)
    user.admin?
  end

  def self.authorizes_to_view_drafts?(user)
    user.admin?
  end

end
