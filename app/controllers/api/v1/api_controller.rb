module Api
  module V1
    class ApiController < ActionController::API
      include ActionController::MimeResponds
      include ::ClimateWatchEngine::Cors
      include ::ClimateWatchEngine::ExceptionResponses
      include ::ClimateWatchEngine::Caching

      before_action :set_locale

      def set_locale
        I18n.locale = params[:locale] || I18n.default_locale
      end
    end
  end
end
