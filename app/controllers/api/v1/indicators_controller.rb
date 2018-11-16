module Api
  module V1
    class IndicatorsController < ApiController
      def index
        indicators = ::Indicator.all
        indicators = indicators.where(section: sections) if sections

        values = ::IndicatorValue.includes(:location, :indicator)
        values = values.where(locations: {iso_code3: locations}) if locations
        values = values.where(indicators: {section: sections}) if sections

        respond_to do |format|
          format.json do
            render json: {
              values: ActiveModelSerializers::SerializableResource.new(
                values,
                each_serializer: Api::V1::IndicatorValueSerializer
              ).as_json,
              indicators: ActiveModelSerializers::SerializableResource.new(
                indicators,
                each_serializer: Api::V1::IndicatorSerializer
              ).as_json
            }
          end
        end
      end

      private

      def locations
        params[:location].presence && params[:location].split(',')
      end

      def sections
        params[:section].presence && params[:section].split(',')
      end
    end
  end
end
