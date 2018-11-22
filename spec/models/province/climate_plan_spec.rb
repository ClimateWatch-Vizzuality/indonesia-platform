require 'rails_helper'

RSpec.describe Province::ClimatePlan, type: :model do
  it 'should be valid' do
    expect(FactoryBot.build(:province_climate_plan)).to be_valid
  end
end
