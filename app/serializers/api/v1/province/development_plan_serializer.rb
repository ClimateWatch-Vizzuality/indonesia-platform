module Api
  module V1
    module Province
      class DevelopmentPlanSerializer < ActiveModel::Serializer
        attributes :location, :rpjmd_period,
                   :supportive_mission_statement, :supportive_policy_directions

        def location
          object.location.iso_code3
        end
      end
    end
  end
end
