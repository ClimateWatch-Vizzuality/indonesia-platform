require 'rails_helper'

RSpec.describe IndicatorValue, type: :model do
  it 'should be valid' do
    expect(FactoryBot.build(:indicator_value)).to be_valid
  end
end
