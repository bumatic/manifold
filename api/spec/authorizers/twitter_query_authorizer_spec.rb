require 'rails_helper'

RSpec.describe TwitterQueryAuthorizer, :authorizer do
  context 'when the subject is an admin' do
    let(:subject) { FactoryBot.create(:user, role: Role::ROLE_ADMIN) }
    let(:object) { FactoryBot.create(:twitter_query) }

    it_should_behave_like "an authorized user for an instance", TwitterQuery, all: true
  end

  context 'when the subject is an editor' do
    let(:subject) { FactoryBot.create(:user, role: Role::ROLE_EDITOR) }
    let(:object) { FactoryBot.create(:twitter_query) }

    it_should_behave_like "an authorized user for an instance", TwitterQuery, all: true
  end

  context 'when the subject is a project_creator' do
    let(:subject) { FactoryBot.create(:user, role: Role::ROLE_PROJECT_CREATOR) }
    let(:object) { FactoryBot.create(:twitter_query) }

    abilities = { create: false, read: false, update: false, delete: false }
    it_should_behave_like "an authorized user for an instance", TwitterQuery, abilities
  end

  context 'when the subject is a marketeer' do
    let(:subject) { FactoryBot.create(:user, role: Role::ROLE_MARKETEER) }
    let(:object) { FactoryBot.create(:twitter_query) }

    abilities = { create: true, read: true, update: true, delete: false }
    it_should_behave_like "an authorized user for an instance", TwitterQuery, abilities
  end

  context 'when the subject is a reader and project_editor of a specific twitter_query' do
    before(:each) do
      @maintainer = FactoryBot.create(:user)
      @twitter_query = FactoryBot.create(:twitter_query)
      @maintainer.add_role Role::ROLE_PROJECT_EDITOR, @twitter_query.project
    end
    let(:subject) { @maintainer }
    let(:object) { @twitter_query }

    it_should_behave_like "an authorized user for an instance", TwitterQuery, all: true
  end

  context 'when the subject is a reader and project_resource_editor of a specific twitter_query' do
    before(:each) do
      @metadata_maintainer = FactoryBot.create(:user)
      @twitter_query = FactoryBot.create(:twitter_query)
      @metadata_maintainer.add_role Role::ROLE_PROJECT_RESOURCE_EDITOR, @twitter_query.project
    end
    let(:subject) { @metadata_maintainer }
    let(:object) { @twitter_query }

    abilities = { create: false, read: true, update: false, delete: false }
    it_should_behave_like "an authorized user for an instance", TwitterQuery, abilities
  end

  context 'when the subject is a reader and project_author of a specific twitter_query' do
    before(:each) do
      @author = FactoryBot.create(:user)
      @twitter_query = FactoryBot.create(:twitter_query)
      @author.add_role Role::ROLE_PROJECT_AUTHOR, @twitter_query.project
    end
    let(:subject) { @author }
    let(:object) { @twitter_query }

    it_should_behave_like "an authorized user for an instance", TwitterQuery, none: true
  end

  context 'when the subject is a reader' do
    let(:subject) { FactoryBot.create(:user) }
    let(:object) { FactoryBot.create(:twitter_query) }

    it_should_behave_like "an authorized user for an instance", TwitterQuery, none: true
  end
end
