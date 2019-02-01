module Api
  module V1
    module Province
      class ClimatePlansController < ApiController
        def index
          plans = ::Province::ClimatePlan.by_current_locale.includes(:location)
          plans = plans.where(locations: {iso_code3: locations}) if locations

          respond_to do |format|
            format.json do
              render json: plans,
                     each_serializer: Api::V1::Province::ClimatePlanSerializer
            end
            format.zip do
              sources = plans.map(&:source).uniq
              data_sources = DataSource.where(short_title: sources)

              render zip: {
                'climate_plans.csv' =>
                  Api::V1::Province::ClimatePlanCSVSerializer.new(plans).to_csv,
                'data_sources.csv' => data_sources.to_csv
              }
            end
          end
        end

        private

        def locations
          params[:location]&.split(',')
        end
      end
    end
  end
end
