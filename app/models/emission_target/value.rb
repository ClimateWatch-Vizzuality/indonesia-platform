# == Schema Information
#
# Table name: emission_target_values
#
#  id           :bigint(8)        not null, primary key
#  first_value  :float
#  second_value :float
#  source       :string
#  unit         :string
#  year         :integer
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#  label_id     :bigint(8)
#  location_id  :bigint(8)
#  sector_id    :bigint(8)
#
# Indexes
#
#  index_emission_target_values_on_label_id     (label_id)
#  index_emission_target_values_on_location_id  (location_id)
#  index_emission_target_values_on_sector_id    (sector_id)
#
# Foreign Keys
#
#  fk_rails_...  (label_id => emission_target_labels.id) ON DELETE => cascade
#  fk_rails_...  (location_id => locations.id) ON DELETE => cascade
#  fk_rails_...  (sector_id => emission_target_sectors.id) ON DELETE => cascade
#

module EmissionTarget
  class Value < ApplicationRecord
    include ClimateWatchEngine::GenericToCsv

    belongs_to :label, class_name: 'EmissionTarget::Label'
    belongs_to :sector, class_name: 'EmissionTarget::Sector'
    belongs_to :location

    validates :year, presence: true
  end
end
