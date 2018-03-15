require 'rails_helper'

RSpec.describe IngestionAuthorizer, :authorizer do
  context 'when the subject is an admin' do
    let(:subject) { FactoryBot.create(:user, role: Role::ROLE_ADMIN) }
    let(:object) { FactoryBot.create(:ingestion) }

    it_should_behave_like "an authorized user for an instance", Ingestion, all: true
  end

  context 'when the subject is an editor' do
    let(:subject) { FactoryBot.create(:user, role: Role::ROLE_EDITOR) }
    let(:object) { FactoryBot.create(:ingestion) }

    it_should_behave_like "an authorized user for an instance", Ingestion, all: true
  end

  context 'when the subject is a project_creator' do
    let(:subject) { FactoryBot.create(:user, role: Role::ROLE_PROJECT_CREATOR) }
    let(:object) { FactoryBot.create(:ingestion) }

    abilities = { create: false, read: false, update: false, delete: false }
    it_should_behave_like "an authorized user for an instance", Ingestion, abilities
  end

  context 'when the subject is a marketeer' do
    let(:subject) { FactoryBot.create(:user, role: Role::ROLE_MARKETEER) }
    let(:object) { FactoryBot.create(:ingestion) }

    abilities = { create: true, read: true, update: true, delete: false }
    it_should_behave_like "an authorized user for an instance", Ingestion, abilities
  end

  context 'when the subject is a reader and project_editor of a specific ingestion' do
    before(:each) do
      @maintainer = FactoryBot.create(:user)
      @ingestion = FactoryBot.create(:ingestion)
      @maintainer.add_role Role::ROLE_PROJECT_EDITOR, @ingestion.project
    end
    let(:subject) { @maintainer }
    let(:object) { @ingestion }

    it_should_behave_like "an authorized user for an instance", Ingestion, all: true
  end

  context 'when the subject is a reader and project_resource_editor of a specific ingestion' do
    before(:each) do
      @metadata_maintainer = FactoryBot.create(:user)
      @ingestion = FactoryBot.create(:ingestion)
      @metadata_maintainer.add_role Role::ROLE_PROJECT_RESOURCE_EDITOR, @ingestion.project
    end
    let(:subject) { @metadata_maintainer }
    let(:object) { @ingestion }

    abilities = { create: false, read: true, update: false, delete: false }
    it_should_behave_like "an authorized user for an instance", Ingestion, abilities
  end

  context 'when the subject is a reader and project_author of a specific ingestion' do
    before(:each) do
      @author = FactoryBot.create(:user)
      @ingestion = FactoryBot.create(:ingestion)
      @author.add_role Role::ROLE_PROJECT_AUTHOR, @ingestion.project
    end
    let(:subject) { @author }
    let(:object) { @ingestion }

    it_should_behave_like "an authorized user for an instance", Ingestion, none: true
  end

  context 'when the subject is a reader' do
    let(:subject) { FactoryBot.create(:user) }
    let(:object) { FactoryBot.create(:ingestion) }

    it_should_behave_like "an authorized user for an instance", Ingestion, none: true
  end
end
