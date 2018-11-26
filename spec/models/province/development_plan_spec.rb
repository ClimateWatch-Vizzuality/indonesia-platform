require 'rails_helper'

RSpec.describe Province::DevelopmentPlan, type: :model do
  it 'should be valid' do
    expect(FactoryBot.build(:province_development_plan)).to be_valid
  end
end
