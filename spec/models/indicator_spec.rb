require 'rails_helper'

RSpec.describe Indicator, type: :model do
  it 'should be invalid when section not present' do
    expect(
      FactoryBot.build(:indicator, section: nil)
    ).to have(1).errors_on(:section)
  end

  it 'should be invalid when unit not present' do
    expect(
      FactoryBot.build(:indicator, unit: nil)
    ).to have(1).errors_on(:unit)
  end

  it 'should be invalid when name not present' do
    expect(
      FactoryBot.build(:indicator, name: nil)
    ).to have(1).errors_on(:name)
  end

  it 'should be invalid when code not present' do
    expect(
      FactoryBot.build(:indicator, code: nil)
    ).to have(1).errors_on(:code)
  end

  it 'should be invalid when code is taken' do
    FactoryBot.create(:indicator, code: 'code')
    expect(
      FactoryBot.build(:indicator, code: 'code')
    ).to have(1).errors_on(:code)
  end

  it 'should be valid' do
    expect(FactoryBot.build(:indicator)).to be_valid
  end
end
