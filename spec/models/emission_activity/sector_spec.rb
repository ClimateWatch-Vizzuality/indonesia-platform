require 'rails_helper'

RSpec.describe EmissionActivity::Sector, type: :model do
  it 'should be invalid when name not present' do
    expect(
      FactoryBot.build(:emission_activity_sector, name: nil)
    ).to have(1).errors_on(:name)
  end

  it 'should be invalid when name in the parent scope is not unique' do
    parent = FactoryBot.create(:emission_activity_sector, name: 'Waste')
    FactoryBot.create(:emission_activity_sector, name: 'Landfills', parent: parent)
    expect(
      FactoryBot.build(:emission_activity_sector, name: 'Landfills', parent: parent)
    ).to have(1).errors_on(:name)
  end

  it 'should be valid when name in the parent scope is unique' do
    FactoryBot.create(
      :emission_activity_sector,
      name: 'Transport',
      parent: FactoryBot.create(:emission_activity_sector)
    )
    expect(
      FactoryBot.build(
        :emission_activity_sector,
        name: 'Transport',
        parent: FactoryBot.create(:emission_activity_sector)
      )
    ).to be_valid
  end

  it 'should be valid' do
    expect(FactoryBot.build(:emission_activity_sector)).to be_valid
  end
end
