# == Schema Information
#
# Table name: province_development_plans
#
#  id                           :bigint(8)        not null, primary key
#  rpjmd_period                 :string
#  source                       :string
#  supportive_mission_statement :text
#  supportive_policy_directions :jsonb
#  created_at                   :datetime         not null
#  updated_at                   :datetime         not null
#  location_id                  :bigint(8)
#
# Indexes
#
#  index_province_development_plans_on_location_id  (location_id)
#
# Foreign Keys
#
#  fk_rails_...  (location_id => locations.id) ON DELETE => cascade
#

module Province
  class DevelopmentPlan < ApplicationRecord
    include ClimateWatchEngine::GenericToCsv

    belongs_to :location

    scope :by_current_locale, -> { where(locale: I18n.locale) }
  end
end
