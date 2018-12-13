FactoryBot.define do
  factory :indicator_value do
    location
    indicator
    association :category, factory: :indicator_category
  end
end
