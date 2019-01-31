# == Schema Information
#
# Table name: emission_activity_values
#
#  id          :bigint(8)        not null, primary key
#  emissions   :jsonb
#  source      :string
#  location_id :bigint(8)
#  sector_id   :bigint(8)
#
# Indexes
#
#  index_emission_activity_values_on_location_id  (location_id)
#  index_emission_activity_values_on_sector_id    (sector_id)
#
# Foreign Keys
#
#  fk_rails_...  (location_id => locations.id) ON DELETE => cascade
#  fk_rails_...  (sector_id => emission_activity_sectors.id) ON DELETE => cascade
#

module EmissionActivity
  class Value < ApplicationRecord
    include ClimateWatchEngine::GenericToCsv

    belongs_to :sector, class_name: 'EmissionActivity::Sector'
    belongs_to :location
  end
end
