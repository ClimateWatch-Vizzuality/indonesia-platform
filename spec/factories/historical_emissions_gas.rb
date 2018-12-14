FactoryBot.define do
  factory :historical_emissions_gas, class: 'HistoricalEmissions::Gas' do
    sequence(:name) { |n| "Name#{n}" }
  end
end
