module Api
  module V1
    module Province
      class ClimatePlansController < ApiController
        def index
          plans = ::Province::ClimatePlan.includes(:location)
          plans = values.where(locations: {iso_code3: locations}) if locations

          respond_to do |format|
            format.json do
              render json: plans,
                     each_serializer: Api::V1::Province::ClimatePlanSerializer
            end
            # format.csv { render csv: values }
          end
        end

        private

        def locations
          params[:location].presence && params[:location].split(',')
        end
      end
    end
  end
end
