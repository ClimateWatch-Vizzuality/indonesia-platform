module Api
  module V1
    class EmissionActivitiesController < ApiController
      def index
        values = ::EmissionActivity::Value.includes(:location, sector: [:parent])
        values = values.where(locations: {iso_code3: locations}) if locations

        respond_to do |format|
          format.json do
            render json: values,
                   each_serializer: Api::V1::EmissionActivity::ValueSerializer
          end
          format.csv do
            send_data values.to_csv,
                      type: 'text/csv',
                      filename: 'emission_activities.csv',
                      disposition: 'attachment'
          end
        end
      end

      private

      def locations
        params[:location].presence && params[:location].split(',')
      end
    end
  end
end
