module Api
  module V1
    module Funding
      class OpportunitySerializer < ActiveModel::Serializer
        attributes :source, :project_name, :mode_of_support, :sectors_and_topics,
                   :description, :application_procedure, :website_link, :last_update_year
      end
    end
  end
end
