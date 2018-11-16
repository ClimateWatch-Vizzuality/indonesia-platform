module Api
  module V1
    class IndicatorValueSerializer < ActiveModel::Serializer
      attribute :indicator_code
      attribute :location
      attribute :location_iso_code3
      attribute :category
      attribute :values

      def location
        object.location.wri_standard_name
      end

      def location_iso_code3
        object.location.iso_code3
      end

      def indicator_code
        object.indicator.code
      end
    end
  end
end
