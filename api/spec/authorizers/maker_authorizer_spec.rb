require 'rails_helper'

RSpec.describe MakerAuthorizer, :authorizer do
  context 'when the subject is an admin' do
    let(:subject) { FactoryBot.create(:user, role: Role::ROLE_ADMIN) }

    it_should_behave_like "an authorized user for a class", Maker, all: true
  end

  context 'when the subject is an editor' do
    let(:subject) { FactoryBot.create(:user, role: Role::ROLE_EDITOR) }

    it_should_behave_like "an authorized user for a class", Maker, all: true
  end

  context 'when the subject is an project_creator' do
    let(:subject) { FactoryBot.create(:user, role: Role::ROLE_PROJECT_CREATOR) }

    it_should_behave_like "an authorized user for a class", Maker, all: true
  end

  context 'when the subject is a reader' do
    let(:subject) { FactoryBot.create(:user) }

    abilities = { create: false, update: false, read: true, delete: false }
    it_should_behave_like "an authorized user for a class", Maker, abilities
  end
end
