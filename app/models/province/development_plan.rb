module Province
  class DevelopmentPlan < ApplicationRecord
    include ClimateWatchEngine::GenericToCsv

    belongs_to :location
  end
end
