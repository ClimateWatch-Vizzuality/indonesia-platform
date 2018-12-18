module Api
  module V1
    class ApiController < ActionController::API
      include ActionController::MimeResponds
      include ::ClimateWatchEngine::Cors
      include ::ClimateWatchEngine::ExceptionResponses
      include ::ClimateWatchEngine::Caching
      include Localizable
    end
  end
end
