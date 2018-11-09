# == Schema Information
#
# Table name: emission_target_labels
#
#  id         :bigint(8)        not null, primary key
#  name       :text             not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
# Indexes
#
#  index_emission_target_labels_on_name  (name) UNIQUE
#

FactoryBot.define do
  factory :emission_target_label, class: 'EmissionTarget::Label' do
    name { ['BAU', 'Target', 'CM1'].sample }
  end
end
