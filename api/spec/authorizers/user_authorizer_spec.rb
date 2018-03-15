require 'rails_helper'

RSpec.describe UserAuthorizer, :authorizer do
  context 'when the subject is an admin' do
    let(:subject) { FactoryBot.create(:user, role: Role::ROLE_ADMIN) }
    let(:object) { FactoryBot.create(:user) }

    it_should_behave_like "an authorized user for an instance", User, all: true
    it_should_behave_like "an authorized user for a class", User, all: true
  end

  context 'when the subject is an editor' do
    let(:subject) { FactoryBot.create(:user, role: Role::ROLE_EDITOR) }
    let(:object) { FactoryBot.create(:user) }

    it_should_behave_like "an authorized user for an instance", User, none: true
    it_should_behave_like "an authorized user for a class", User, none: true
  end

  context 'when the subject is a project_creator' do
    let(:subject) { FactoryBot.create(:user, role: Role::ROLE_PROJECT_CREATOR) }
    let(:object) { FactoryBot.create(:user) }

    it_should_behave_like "an authorized user for an instance", User, none: true
    it_should_behave_like "an authorized user for a class", User, none: true
  end

  context 'when the subject is a reader' do
    let(:subject) { FactoryBot.create(:user) }
    let(:object) { FactoryBot.create(:user) }

    it_should_behave_like "an authorized user for an instance", User, none: true
    it_should_behave_like "an authorized user for a class", User, none: true
  end

  context 'when the subject is the user' do
    let(:subject) { FactoryBot.create(:user) }
    let(:object) { subject }

    abilities = { create: false, read: true, update: true, delete: false }
    it_should_behave_like "an authorized user for an instance", User, abilities
  end
end
