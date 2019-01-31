module Api
  module V1
    module EmissionTarget
      class ValueSerializer < ActiveModel::Serializer
        attribute :source
        attribute :location
        attribute :value
        attribute :label
        attribute :sector
        attribute :sector_name
        attribute :year
        attribute :unit

        def location
          object.location.iso_code3
        end

        def label
          Code.create(object.label.name)
        end

        def sector
          object.sector.code
        end

        def sector_name
          object.sector.name
        end

        def value
          if object.first_value.present? && object.second_value.blank?
            object.first_value
          elsif object.first_value.present? && object.second_value.present?
            [object.first_value, object.second_value]
          end
        end
      end
    end
  end
end
