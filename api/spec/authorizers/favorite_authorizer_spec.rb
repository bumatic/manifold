require 'rails_helper'

RSpec.describe FavoriteAuthorizer, :authorizer do
  let(:owner) { FactoryBot.create(:user) }
  let(:object) { FactoryBot.create(:favorite, user: owner) }

  context 'when the subject is an admin' do
    let(:subject) { FactoryBot.create(:user, role: Role::ROLE_ADMIN) }

    it_should_behave_like "an authorized user for an instance", Favorite, all: true
  end

  context 'when the subject is a reader' do
    let(:subject) { FactoryBot.create(:user) }

    it_should_behave_like "an authorized user for an instance", Favorite, none: true
  end

  context 'when the subject is the resource owner' do
    let(:subject) { owner }

    it_should_behave_like "an authorized user for an instance", Favorite, all: true
  end
end
