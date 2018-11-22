module Province
  class ClimatePlan < ApplicationRecord
    belongs_to :location
  end
end
