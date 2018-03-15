require 'rails_helper'

RSpec.describe PermissionAuthorizer, :authorizer do
  context 'when the subject is an admin' do
    let(:subject) { FactoryBot.create(:user, role: Role::ROLE_ADMIN) }

    it_should_behave_like "an authorized user for a class", Permission, all: true
  end

  context 'when the subject is a reader' do
    let(:subject) { FactoryBot.create(:user) }

    it_should_behave_like "an authorized user for a class", Permission, none: true
  end
end
