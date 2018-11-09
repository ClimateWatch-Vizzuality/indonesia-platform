FactoryBot.define do
  factory :emission_target_label, class: 'EmissionTarget::Label' do
    sequence(:name) { |n| "Label#{n}" }
  end
end
