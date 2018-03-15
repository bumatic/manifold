require 'rails_helper'

RSpec.describe TextAuthorizer, :authorizer do
  context 'when the subject is an admin' do
    let(:subject) { FactoryBot.create(:user, role: Role::ROLE_ADMIN) }
    let(:object) { FactoryBot.create(:text) }

    it_should_behave_like "an authorized user for an instance", Text, all: true
  end

  context 'when the subject is an editor' do
    let(:subject) { FactoryBot.create(:user, role: Role::ROLE_EDITOR) }
    let(:object) { FactoryBot.create(:text) }

    it_should_behave_like "an authorized user for an instance", Text, all: true
  end

  context 'when the subject is a project_creator' do
    let(:subject) { FactoryBot.create(:user, role: Role::ROLE_PROJECT_CREATOR) }
    let(:object) { FactoryBot.create(:text) }

    abilities = { create: false, read: false, update: false, delete: false }
    it_should_behave_like "an authorized user for an instance", Text, abilities
  end

  context 'when the subject is a marketeer' do
    let(:subject) { FactoryBot.create(:user, role: Role::ROLE_MARKETEER) }
    let(:object) { FactoryBot.create(:text) }

    abilities = { create: true, read: true, update: true, delete: false }
    it_should_behave_like "an authorized user for an instance", Text, abilities
  end

  context 'when the subject is a reader and project_editor of a specific text' do
    before(:each) do
      @maintainer = FactoryBot.create(:user)
      @text = FactoryBot.create(:text)
      @maintainer.add_role Role::ROLE_PROJECT_EDITOR, @text.project
    end
    let(:subject) { @maintainer }
    let(:object) { @text }

    it_should_behave_like "an authorized user for an instance", Text, all: true
  end

  context 'when the subject is a reader and project_resource_editor of a specific text' do
    before(:each) do
      @metadata_maintainer = FactoryBot.create(:user)
      @text = FactoryBot.create(:text)
      @metadata_maintainer.add_role Role::ROLE_PROJECT_RESOURCE_EDITOR, @text.project
    end
    let(:subject) { @metadata_maintainer }
    let(:object) { @text }

    abilities = { create: false, read: true, update: false, delete: false }
    it_should_behave_like "an authorized user for an instance", Text, abilities
  end

  context 'when the subject is a reader and project_author of a specific text' do
    before(:each) do
      @author = FactoryBot.create(:user)
      @text = FactoryBot.create(:text)
      @author.add_role Role::ROLE_PROJECT_AUTHOR, @text.project
    end
    let(:subject) { @author }
    let(:object) { @text }

    it_should_behave_like "an authorized user for an instance", Text, none: true
  end

  context 'when the subject is a reader' do
    let(:subject) { FactoryBot.create(:user) }
    let(:object) { FactoryBot.create(:text) }

    it_should_behave_like "an authorized user for an instance", Text, none: true
  end
end
