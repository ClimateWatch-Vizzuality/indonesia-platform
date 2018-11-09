require 'rails_helper'

RSpec.describe EmissionTarget::Sector, type: :model do
  it 'should be invalid when name not present' do
    expect(
      FactoryBot.build(:emission_target_sector, name: nil)
    ).to have(1).errors_on(:name)
  end

  it 'should be invalid when name is taken' do
    FactoryBot.create(:emission_target_sector, name: 'Waste')
    expect(
      FactoryBot.build(:emission_target_sector, name: 'Waste')
    ).to have(1).errors_on(:name)
  end

  it 'should be valid' do
    expect(FactoryBot.build(:emission_target_sector)).to be_valid
  end
end
