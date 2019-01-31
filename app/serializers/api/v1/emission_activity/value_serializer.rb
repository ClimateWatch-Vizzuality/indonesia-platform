module Api
  module V1
    module EmissionActivity
      class ValueSerializer < ActiveModel::Serializer
        attribute :source
        attribute :location
        attribute :location_iso_code3
        attribute :sector_code
        attribute :sector
        attribute :activity
        attribute :emissions

        def location
          object.location.wri_standard_name
        end

        def location_iso_code3
          object.location.iso_code3
        end

        def sector_code
          object.sector&.parent&.code
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
