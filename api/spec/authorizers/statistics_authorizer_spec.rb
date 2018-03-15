require 'rails_helper'

RSpec.describe StatisticsAuthorizer, :authorizer do
  context 'when the subject is an admin' do
    let(:subject) { FactoryBot.create(:user, role: Role::ROLE_ADMIN) }

    abilities = { create: false, read: true, update: false, delete: false }
    it_should_behave_like "an authorized user for a class", Statistics, abilities
  end

  context 'when the subject is an editor' do
    let(:subject) { FactoryBot.create(:user, role: Role::ROLE_EDITOR) }

    abilities = { create: false, read: true, update: false, delete: false }
    it_should_behave_like "an authorized user for a class", Statistics, abilities
  end

  context 'when the subject is a marketeer' do
    let(:subject) { FactoryBot.create(:user, role: Role::ROLE_MARKETEER) }

    abilities = { create: false, read: true, update: false, delete: false }
    it_should_behave_like "an authorized user for a class", Statistics, abilities
  end

  context 'when the subject is a reader' do
    let(:subject) { FactoryBot.create(:user) }

    it_should_behave_like "an authorized user for a class", Statistics, none: true
  end
end
