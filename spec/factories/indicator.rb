FactoryBot.define do
  factory :indicator do
    code { 'GDP_price' }
    section { 'socioeconomic' }
    name { 'GDP at current price' }
    unit { 'MW' }
  end
end
