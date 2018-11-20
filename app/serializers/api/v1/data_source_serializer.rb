module Api
  module V1
    class DataSourceSerializer < ApplicationSerializer
      attributes :short_title, :title, :source_organization,
                 :learn_more_link, :citation
    end
  end
end
