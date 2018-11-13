FactoryBot.define do
  factory :emission_activity_sector, class: 'EmissionActivity::Sector' do
    sequence(:name) { |n| "Sector#{n}" }
  end
end
