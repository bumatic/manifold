require 'rails_helper'

RSpec.describe SettingsAuthorizer, :authorizer do
  context 'when the subject is an admin' do
    let(:subject) { FactoryBot.create(:user, role: Role::ROLE_ADMIN) }

    abilities = { create: false, read: true, update: true, delete: false }
    it_should_behave_like "an authorized user for a class", Settings, abilities
  end

  context 'when the subject is an editor' do
    let(:subject) { FactoryBot.create(:user, role: Role::ROLE_EDITOR) }

    it_should_behave_like "an authorized user for a class", Settings, none: true
  end

  context 'when the subject is a reader' do
    let(:subject) { FactoryBot.create(:user) }

    it_should_behave_like "an authorized user for a class", Settings, none: true
  end
end
