FactoryBot.define do
  factory :historical_emissions_sector, class: 'HistoricalEmissions::Sector' do
    sequence(:name) { |n| "Name#{n}" }
    association :data_source, factory: :historical_emissions_data_source
  end
end
