module Api
  module V1
    class SectionContentController < ApiController
      DEFAULT_LANGUAGE = 'en'.freeze

      def index
        section_contents = SectionContent.where(
          locale: params[:locale].presence || DEFAULT_LANGUAGE
        )

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
