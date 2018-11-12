require 'rails_helper'

RSpec.describe AdminUser, type: :model do
  describe :superuser? do
    let(:superuser) { FactoryBot.create(:admin_user, role: 'superuser') }
    let(:user) { FactoryBot.create(:admin_user) }

    it 'returns true when role set' do
      expect(superuser).to be_superuser
    end

    it 'returns false when role not set' do
      expect(user).not_to be_superuser
    end
  end
end
