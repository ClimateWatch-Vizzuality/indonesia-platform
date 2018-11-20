FactoryBot.define do
  factory :indicator_value do
    location
    indicator
    category { 'category' }
  end
end
