require 'rails_helper'

RSpec.describe CommentAuthorizer, :authorizer do
  let(:creator) { FactoryBot.create(:user, role: Role::ROLE_READER) }
  let(:object) { FactoryBot.create(:comment, creator: creator) }

  context 'when the subject is an admin' do
    let(:subject) { FactoryBot.create(:user, role: Role::ROLE_ADMIN) }

    it_should_behave_like "an authorized user for an instance", Comment, all: true
  end

  context 'when the subject is an editor' do
    let(:subject) { FactoryBot.create(:user, role: Role::ROLE_EDITOR) }

    abilities = { create: true, read: true, update: false, delete: true }
    it_should_behave_like "an authorized user for an instance", Comment, abilities
  end

  context 'when the subject is a reader' do
    let(:subject) { FactoryBot.create(:user) }

    abilities = { create: true, read: true, update: false, delete: false }
    it_should_behave_like "an authorized user for an instance", Comment, abilities
  end

  context 'when the subject is the resource creator' do
    let(:subject) { creator }

    it_should_behave_like "an authorized user for an instance", Comment, all: true
  end
end
