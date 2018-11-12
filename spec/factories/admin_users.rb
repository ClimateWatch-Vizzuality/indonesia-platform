FactoryBot.define do
  factory :admin_user do
    sequence(:email) { |n| "user#{n}@example.com" }
    password { 'test123' }
    role { 'admin' }
  end
end
