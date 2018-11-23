# == Schema Information
#
# Table name: data_sources
#
#  id              :bigint(8)        not null, primary key
#  learn_more_link :string
#  short_title     :string
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#
# Indexes
#
#  index_data_sources_on_short_title  (short_title) UNIQUE
#

class DataSource < ApplicationRecord
  include ClimateWatchEngine::GenericToCsv

  translates :title, :source_organization, :caution, :description, :citation, :summary

  validates :short_title, presence: true, uniqueness: true

  default_scope { includes(:translations) }
end
