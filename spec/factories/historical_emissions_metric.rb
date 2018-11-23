FactoryBot.define do
  factory :historical_emissions_metric, class: 'HistoricalEmissions::Metric' do
    sequence(:name) { |n| "Name#{n}" }
    sequence(:unit) { |n| "Unit#{n}" }
  end
end
