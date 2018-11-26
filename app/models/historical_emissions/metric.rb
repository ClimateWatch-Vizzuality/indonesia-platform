# == Schema Information
#
# Table name: historical_emissions_metrics
#
#  id   :bigint(8)        not null, primary key
#  name :string           not null
#  unit :string           not null
#
# Indexes
#
#  index_historical_emissions_metrics_on_name_and_unit  (name,unit) UNIQUE
#

module HistoricalEmissions
  class Metric < ApplicationRecord
    validates_presence_of :name, :unit

    validates :unit, uniqueness: {scope: :name}
  end
end
