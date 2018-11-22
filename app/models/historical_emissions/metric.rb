module HistoricalEmissions
  class Metric < ApplicationRecord
    validates_presence_of :name, :unit

    validates :unit, uniqueness: {scope: :name}
  end
end
