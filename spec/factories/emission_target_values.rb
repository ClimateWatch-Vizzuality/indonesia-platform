FactoryBot.define do
  factory :emission_target_value, class: 'EmissionTarget::Value' do
    location
    association :label, factory: :emission_target_label
    association :sector, factory: :emission_target_sector
    year { '2030' }
    first_value { 1.2 }
  end
end
