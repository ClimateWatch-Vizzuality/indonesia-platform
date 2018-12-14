# == Schema Information
#
# Table name: emission_target_sectors
#
#  id           :bigint(8)        not null, primary key
#  name         :text             not null
#  translations :jsonb
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#
# Indexes
#
#  index_emission_target_sectors_on_name  (name) UNIQUE
#

FactoryBot.define do
  factory :emission_target_sector, class: 'EmissionTarget::Sector' do
    sequence(:name) { |n| "Sector#{n}" }
  end
end
