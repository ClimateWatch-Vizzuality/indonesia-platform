require 'rails_helper'

RSpec.describe HistoricalEmissions::Metric, type: :model do
  it 'should be invalid when name not present' do
    expect(
      FactoryBot.build(:historical_emissions_metric, name: nil)
    ).to have(1).errors_on(:name)
  end

  it 'should be invalid when unit not present' do
    expect(
      FactoryBot.build(:historical_emissions_metric, unit: nil)
    ).to have(1).errors_on(:unit)
  end

  it 'should be invalid when name with unit is taken' do
    FactoryBot.create(:historical_emissions_metric, name: 'metric', unit: 'unit')
    expect(
      FactoryBot.build(:historical_emissions_metric, name: 'metric', unit: 'unit')
    ).to have(1).errors_on(:unit)
  end

  it 'should be valid' do
    expect(FactoryBot.build(:historical_emissions_metric)).to be_valid
  end
end
