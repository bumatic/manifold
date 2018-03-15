require 'rails_helper'

RSpec.describe CollectionAuthorizer, :authorizer do
  context 'when the subject is an admin' do
    let(:subject) { FactoryBot.create(:user, role: Role::ROLE_ADMIN) }
    let(:object) { FactoryBot.create(:collection) }

    it_should_behave_like "an authorized user for an instance", Collection, all: true
  end

  context 'when the subject is an editor' do
    let(:subject) { FactoryBot.create(:user, role: Role::ROLE_EDITOR) }
    let(:object) { FactoryBot.create(:collection) }

    it_should_behave_like "an authorized user for an instance", Collection, all: true
  end

  context 'when the subject is a project_creator' do
    let(:subject) { FactoryBot.create(:user, role: Role::ROLE_PROJECT_CREATOR) }
    let(:object) { FactoryBot.create(:collection) }

    it_should_behave_like "an authorized user for an instance", Collection, none: true
  end

  context 'when the subject is a marketeer' do
    let(:subject) { FactoryBot.create(:user, role: Role::ROLE_MARKETEER) }
    let(:object) { FactoryBot.create(:collection) }

    abilities = { create: true, read: true, update: true, delete: false }
    it_should_behave_like "an authorized user for an instance", Collection, abilities
  end

  context 'when the subject is a reader and project_editor of a specific collection' do
    before(:each) do
      @maintainer = FactoryBot.create(:user)
      @collection = FactoryBot.create(:collection)
      @maintainer.add_role Role::ROLE_PROJECT_EDITOR, @collection.project
    end
    let(:subject) { @maintainer }
    let(:object) { @collection }

    it_should_behave_like "an authorized user for an instance", Collection, all: true
  end

  context 'when the subject is a reader and project_resource_editor of a specific collection' do
    before(:each) do
      @metadata_maintainer = FactoryBot.create(:user)
      @collection = FactoryBot.create(:collection)
      @metadata_maintainer.add_role Role::ROLE_PROJECT_RESOURCE_EDITOR, @collection.project
    end
    let(:subject) { @metadata_maintainer }
    let(:object) { @collection }

    abilities = { create: false, read: true, update: false, delete: false }
    it_should_behave_like "an authorized user for an instance", Collection, abilities
  end

  context 'when the subject is a reader and project_author of a specific collection' do
    before(:each) do
      @author = FactoryBot.create(:user)
      @collection = FactoryBot.create(:collection)
      @author.add_role Role::ROLE_PROJECT_AUTHOR, @collection.project
    end
    let(:subject) { @author }
    let(:object) { @collection }

    it_should_behave_like "an authorized user for an instance", Collection, none: true
  end

  context 'when the subject is a reader' do
    let(:subject) { FactoryBot.create(:user) }
    let(:object) { FactoryBot.create(:collection) }

    it_should_behave_like "an authorized user for an instance", Collection, none: true
  end
end
