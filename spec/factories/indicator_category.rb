FactoryBot.define do
  factory :indicator_category do
    sequence(:name) { |n| "category#{n}" }
  end
end
