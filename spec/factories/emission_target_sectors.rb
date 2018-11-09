FactoryBot.define do
  factory :emission_target_sector, class: 'EmissionTarget::Sector' do
    sequence(:name) { |n| "Sector#{n}" }
  end
end
