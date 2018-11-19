# == Schema Information
#
# Table name: indicator_values
#
#  id           :bigint(8)        not null, primary key
#  category     :string
#  source       :string
#  values       :jsonb
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#  indicator_id :bigint(8)
#  location_id  :bigint(8)
#
# Indexes
#
#  index_indicator_values_on_indicator_id  (indicator_id)
#  index_indicator_values_on_location_id   (location_id)
#
# Foreign Keys
#
#  fk_rails_...  (indicator_id => indicators.id) ON DELETE => cascade
#  fk_rails_...  (location_id => locations.id) ON DELETE => cascade
#

class IndicatorValue < ApplicationRecord
  include ClimateWatchEngine::GenericToCsv

  belongs_to :location
  belongs_to :indicator
end
