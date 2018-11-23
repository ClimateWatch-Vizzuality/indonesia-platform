module Api
  module V1
    module Province
      class DevelopmentPlansController < ApiController
        def index
          plans = ::Province::DevelopmentPlan.for_current_locale.includes(:location)
          plans = plans.where(locations: {iso_code3: locations}) if locations

          respond_to do |format|
            format.json do
              render json: plans,
                     each_serializer: Api::V1::Province::DevelopmentPlanSerializer
            end
            format.csv do
              render csv: plans, serializer: Api::V1::Province::DevelopmentPlanCSVSerializer
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
end
