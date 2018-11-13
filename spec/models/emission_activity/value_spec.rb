require 'rails_helper'

RSpec.describe EmissionActivity::Value, type: :model do
  it 'should be invalid when sector not present' do
    expect(
      FactoryBot.build(:emission_activity_value, sector: nil)
    ).to have(1).errors_on(:sector)
  end

  it 'should be valid' do
    expect(FactoryBot.build(:emission_activity_value)).to be_valid
  end
end
