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

module EmissionTarget
  class Label < ApplicationRecord
    validates :name, presence: true, uniqueness: true
  end
end
