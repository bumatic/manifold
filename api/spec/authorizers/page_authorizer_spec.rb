require 'rails_helper'

RSpec.describe PageAuthorizer, :authorizer do
  context 'when the subject is an admin' do
    let(:subject) { FactoryBot.create(:user, role: Role::ROLE_ADMIN) }

    it_should_behave_like "an authorized user for a class", Page, all: true
  end

  context 'when the subject is an editor' do
    let(:subject) { FactoryBot.create(:user, role: Role::ROLE_EDITOR) }

    it_should_behave_like "an authorized user for a class", Page, all: true
  end

  context 'when the subject is a marketeer' do
    let(:subject) { FactoryBot.create(:user, role: Role::ROLE_MARKETEER) }

    it_should_behave_like "an authorized user for a class", Page, all: true
  end

  context 'when the subject is a reader' do
    let(:subject) { FactoryBot.create(:user) }

    abilities = { create: false, update: false, read: true, delete: false }
    it_should_behave_like "an authorized user for a class", Page, abilities
  end
end
