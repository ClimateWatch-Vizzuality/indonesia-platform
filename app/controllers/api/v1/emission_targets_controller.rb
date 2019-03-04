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
          format.zip do
            sources = values.map(&:source).uniq
            data_sources = DataSource.where(short_title: sources)

            render zip: {
              'emission_targets.csv' => values.to_csv,
              'data_sources.csv' => data_sources.to_csv
            }
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
