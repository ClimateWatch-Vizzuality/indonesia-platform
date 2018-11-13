module Api
  module V1
    module EmissionActivity
      class ValueSerializer < ActiveModel::Serializer
        attribute :location
        attribute :sector
        attribute :activity
        attribute :emissions

        def location
          object.location.iso_code3
        end

        def sector
          object.sector&.parent&.name
        end

        def activity
          object.sector.name
        end
      end
    end
  end
end
