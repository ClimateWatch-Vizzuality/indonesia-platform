module Api
  module V1
    module Province
      class ClimatePlanSerializer < ActiveModel::Serializer
        attributes :location, :source, :sector, :sub_sector, :mitigation_activities

        def location
          object.location.iso_code3
        end
      end
    end
  end
end
