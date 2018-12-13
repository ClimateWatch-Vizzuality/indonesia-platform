module Api
  module V1
    module EmissionActivity
      class ValueSerializer < ActiveModel::Serializer
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
          I18n.with_locale(:en) { Code.create(sector) }
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
