require 'rails_helper'

RSpec.describe IndicatorCategory, type: :model do
  it 'should be invalid when name not present' do
    expect(
      FactoryBot.build(:indicator_category, name: nil)
    ).to have(1).errors_on(:name)
  end

  it 'should be invalid when name is taken' do
    FactoryBot.create(:indicator_category, name: 'category')
    expect(
      FactoryBot.build(:indicator_category, name: 'category')
    ).to have(1).errors_on(:name)
  end

  it 'should be valid' do
    expect(FactoryBot.build(:indicator_category)).to be_valid
  end
end
