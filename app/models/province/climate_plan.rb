# == Schema Information
#
# Table name: province_climate_plans
#
#  id                    :bigint(8)        not null, primary key
#  mitigation_activities :text
#  sector                :string
#  source                :string
#  sub_sector            :string
#  created_at            :datetime         not null
#  updated_at            :datetime         not null
#  location_id           :bigint(8)
#
# Indexes
#
#  index_province_climate_plans_on_location_id  (location_id)
#
# Foreign Keys
#
#  fk_rails_...  (location_id => locations.id) ON DELETE => cascade
#

module Province
  class ClimatePlan < ApplicationRecord
    belongs_to :location

    scope :for_current_locale, -> { where(locale: I18n.locale) }
  end
end
