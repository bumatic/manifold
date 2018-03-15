require 'rails_helper'

RSpec.describe ProjectAuthorizer, :authorizer do
  context 'when the subject is an admin' do
    let(:subject) { FactoryBot.create(:user, role: Role::ROLE_ADMIN) }
    let(:object) { FactoryBot.create(:project, draft: true) }

    it_should_behave_like "an authorized user for an instance", Project, all: true
  end

  context 'when the subject is an editor' do
    let(:subject) { FactoryBot.create(:user, role: Role::ROLE_EDITOR) }
    let(:object) { FactoryBot.create(:project, draft: true) }

    it_should_behave_like "an authorized user for an instance", Project, all: true
  end

  context 'when the subject is a project_creator' do
    let(:subject) { FactoryBot.create(:user, role: Role::ROLE_PROJECT_CREATOR) }
    let(:object) { FactoryBot.create(:project, draft: true) }

    abilities = { create: true, read: false, update: false, delete: false }
    it_should_behave_like "an authorized user for an instance", Project, abilities
  end

  context 'when the subject is a marketeer' do
    let(:subject) { FactoryBot.create(:user, role: Role::ROLE_MARKETEER) }
    let(:object) { FactoryBot.create(:project, draft: true) }

    abilities = { create: false, read: true, update: true, delete: false }
    it_should_behave_like "an authorized user for an instance", Project, abilities
  end

  context 'when the subject is a reader and project_editor of a specific project' do
    before(:each) do
      @project_editor = FactoryBot.create(:user)
      @project = FactoryBot.create(:project, draft: true)
      @project_editor.add_role Role::ROLE_PROJECT_EDITOR, @project
    end
    let(:subject) { @project_editor }
    let(:object) { @project }

    abilities = { create: false, read: true, update: true, delete: true }
    it_should_behave_like "an authorized user for an instance", Project, abilities
  end

  context 'when the subject is a reader and project_resource_editor of a specific project' do
    before(:each) do
      @metadata_editor = FactoryBot.create(:user)
      @project = FactoryBot.create(:project, draft: true)
      @metadata_editor.add_role Role::ROLE_PROJECT_RESOURCE_EDITOR, @project
    end
    let(:subject) { @metadata_editor }
    let(:object) { @project }

    abilities = { create: false, read: true, update: false, delete: false }
    it_should_behave_like "an authorized user for an instance", Project, abilities
  end

  context 'when the subject is a reader and project_author of a specific project' do
    before(:each) do
      @author = FactoryBot.create(:user)
      @project = FactoryBot.create(:project, draft: true)
      @author.add_role Role::ROLE_PROJECT_AUTHOR, @project
    end
    let(:subject) { @author }
    let(:object) { @project }

    it_should_behave_like "an authorized user for an instance", Project, none: true
  end

  context 'when the subject is a reader' do
    let(:subject) { FactoryBot.create(:user) }
    let(:object) { FactoryBot.create(:project, draft: true) }

    it_should_behave_like "an authorized user for an instance", Project, none: true
  end
end
