module Api
  module V1
    class FundingOpportunitiesController < ApiController
      def index
        opportunities = ::Funding::Opportunity.by_current_locale

        respond_to do |format|
          format.json do
            render json: opportunities,
                   each_serializer: Api::V1::Funding::OpportunitySerializer
          end
          format.csv { render csv: opportunities }
        end
      end
    end
  end
end
