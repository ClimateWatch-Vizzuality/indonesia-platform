FactoryBot.define do
  factory :emission_activity_value, class: 'EmissionActivity::Value' do
    location
    association :sector, factory: :emission_activity_sector
    emissions { [{year: 2010, value: 3000}, {year: 2011, value: 3030}] }
  end
end
