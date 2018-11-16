module Api
  module V1
    class IndicatorValueSerializer < ActiveModel::Serializer
      attribute :indicator_code
      attribute :values

      def indicator_code
        object.indicator.code
      end
    end
  end
end
