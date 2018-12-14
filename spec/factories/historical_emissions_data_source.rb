FactoryBot.define do
  factory :historical_emissions_data_source, class: 'HistoricalEmissions::DataSource' do
    name { 'data source name' }
  end
end
