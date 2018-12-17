# == Schema Information
#
# Table name: funding_opportunities
#
#  id                    :bigint(8)        not null, primary key
#  application_procedure :text
#  description           :text
#  last_update_year      :integer
#  locale                :string           default("en"), not null
#  mode_of_support       :text
#  project_name          :text
#  sectors_and_topics    :text
#  source                :string
#  website_link          :text
#  created_at            :datetime         not null
#  updated_at            :datetime         not null
#

module Funding
  class Opportunity < ApplicationRecord
    include ClimateWatchEngine::GenericToCsv

    scope :by_current_locale, -> { where(locale: I18n.locale) }
  end
end
