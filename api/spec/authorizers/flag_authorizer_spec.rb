require 'rails_helper'

RSpec.describe FlagAuthorizer, :authorizer do
  let(:creator) { FactoryBot.create(:user, role: Role::ROLE_READER) }
  let(:object) { FactoryBot.create(:flag, creator: creator) }

  context 'when the subject is an admin' do
    let(:subject) { FactoryBot.create(:user, role: Role::ROLE_ADMIN) }

    abilities = { create: true, read: false, update: false, delete: true }
    it_should_behave_like "an authorized user for an instance", Flag, abilities
  end

  context 'when the subject is a reader' do
    let(:subject) { FactoryBot.create(:user) }

    abilities = { create: true, read: false, update: false, delete: false }
    it_should_behave_like "an authorized user for an instance", Flag, abilities
  end

  context 'when the subject is the resource creator' do
    let(:subject) { creator }

    abilities = { create: true, read: false, update: false, delete: true }
    it_should_behave_like "an authorized user for an instance", Flag, abilities
  end
end
