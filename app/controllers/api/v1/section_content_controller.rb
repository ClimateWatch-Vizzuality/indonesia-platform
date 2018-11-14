module Api
  module V1
    class SectionContentController < ApiController
      DEFAULT_LANGUAGE = 'en'.freeze

      def index
        locale = params[:locale]
        section_contents =
          if locale
            SectionContent.where(locale: locale)
          else
            SectionContent.where(locale: DEFAULT_LANGUAGE)
          end

        respond_to do |format|
          format.json do
            render json: section_contents,
                   each_serializer: Api::V1::SectionContentSerializer
          end
        end
      end
    end
  end
end
