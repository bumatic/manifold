require 'rails_helper'

RSpec.describe VersionAuthorizer, :authorizer do
  context 'when the subject is an admin' do
    let(:subject) { FactoryBot.create(:user, role: Role::ROLE_ADMIN) }

    abilities = { create: false, read: true, update: false, delete: false }
    it_should_behave_like "an authorized user for a class", Version, abilities
  end

  context 'when the subject is an editor' do
    let(:subject) { FactoryBot.create(:user, role: Role::ROLE_EDITOR) }

    abilities = { create: false, read: true, update: false, delete: false }
    it_should_behave_like "an authorized user for a class", Version, abilities
  end

end
