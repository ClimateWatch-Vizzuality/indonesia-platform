require 'rails_helper'

RSpec.describe EmissionTarget::Label, type: :model do
  it 'should be invalid when name not present' do
    expect(
      FactoryBot.build(:emission_target_label, name: nil)
    ).to have(1).errors_on(:name)
  end

  it 'should be invalid when name is taken' do
    FactoryBot.create(:emission_target_label, name: 'BAU')
    expect(
      FactoryBot.build(:emission_target_label, name: 'BAU')
    ).to have(1).errors_on(:name)
  end

  it 'should be valid' do
    expect(FactoryBot.build(:emission_target_label)).to be_valid
  end
end
