require 'rails_helper'

RSpec.describe Province::DevPlan, type: :model do
  it 'should be valid' do
    expect(FactoryBot.build(:province_dev_plan)).to be_valid
  end
end
