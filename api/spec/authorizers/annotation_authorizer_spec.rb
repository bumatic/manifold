require 'rails_helper'

RSpec.describe AnnotationAuthorizer, :authorizer do
  let(:user) { FactoryBot.create(:user) }
  let(:admin) { FactoryBot.create(:user, role: Role::ROLE_ADMIN) }

  describe 'instance authorization' do
    let(:creator) { FactoryBot.create(:user) }
    let(:annotation_resource) { FactoryBot.create(:annotation, creator: creator) }
    let(:notation_resource) { FactoryBot.create(:resource_annotation, creator: creator) }

    context 'when creating' do
      context "when notation" do
        it 'is true for admin' do
          expect(notation_resource).to be_creatable_by(admin)
        end

        it 'is false for user' do
          expect(notation_resource).to_not be_creatable_by(user)
        end
      end
    end

    context 'when updating' do
      it 'is true for admin' do
        expect(annotation_resource).to be_updatable_by(admin)
      end

      it 'is false for user' do
        expect(annotation_resource).to_not be_updatable_by(user)
      end

      it 'is true for creator' do
        expect(annotation_resource).to be_updatable_by(creator)
      end
    end

    context 'when deleting' do
      it 'is true for admin' do
        expect(annotation_resource).to be_deletable_by(admin)
      end

      it 'is false for user' do
        expect(annotation_resource).to_not be_deletable_by(user)
      end

      it 'is true for creator' do
        expect(annotation_resource).to be_updatable_by(creator)
      end
    end
  end

end
