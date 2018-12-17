module Api
  module V1
    class TranslationsController < ApiController
      def index
        render json: I18n.t('app')
      end
    end
  end
end
