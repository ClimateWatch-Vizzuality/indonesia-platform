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
          format.zip do
            sources = opportunities.map(&:source).uniq
            data_sources = DataSource.where(short_title: sources)

            render zip: {
              'funding_opportunities.csv' => opportunities.to_csv,
              'data_sources.csv' => data_sources.to_csv
            }
          end
        end
      end
    end
  end
end
