require 'rails_helper'

RSpec.describe EmissionTarget::Value, type: :model do
  it 'should be invalid when label not present' do
    expect(
      FactoryBot.build(:emission_target_value, label: nil)
    ).to have(1).errors_on(:label)
  end

  it 'should be invalid when sector not present' do
    expect(
      FactoryBot.build(:emission_target_value, sector: nil)
    ).to have(1).errors_on(:sector)
  end
end
