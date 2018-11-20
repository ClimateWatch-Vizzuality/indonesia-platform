module Api
  module V1
    class EmissionTargetsController < ApiController
      def index
        values = ::EmissionTarget::Value.includes(:location, :label, :sector)
        values = values.where(locations: {iso_code3: locations}) if locations

        respond_to do |format|
          format.json do
            render json: values,
                   each_serializer: Api::V1::EmissionTarget::ValueSerializer
          end
          format.csv { render csv: values }
        end
      end

      private

      def locations
        params[:location].presence && params[:location].split(',')
      end
    end
  end
end
