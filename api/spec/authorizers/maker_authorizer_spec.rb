require 'rails_helper'

RSpec.describe MakerAuthorizer, :authorizer do
  let(:user) { FactoryBot.create(:user) }
  let(:admin) { FactoryBot.create(:user, role: User::ROLE_ADMIN) }

  describe 'class authorization' do
    context 'when creating' do
      it 'is true for admin' do
        expect(MakerAuthorizer).to be_creatable_by(admin)
      end

      it 'is false for user' do
        expect(MakerAuthorizer).to_not be_creatable_by(user)
      end
    end

    context 'when updating' do
      it 'is true for admin' do
        expect(MakerAuthorizer).to be_updatable_by(admin)
      end

      it 'is false for user' do
        expect(MakerAuthorizer).to_not be_updatable_by(user)
      end
    end

    context 'when deleting' do
      it 'is true for admin' do
        expect(MakerAuthorizer).to be_deletable_by(admin)
      end

      it 'is false for user' do
        expect(MakerAuthorizer).to_not be_deletable_by(user)
      end
    end
  end
end
