module Api
  module V1
    class CommitmentTimelineEntriesController < ApiController
      def index
        render json: ::CommitmentTimeline::Entry.by_current_locale,
               each_serializer: Api::V1::CommitmentTimeline::EntrySerializer
      end

      private

      def locations
        params[:location].presence && params[:location].split(',')
      end
    end
  end
end
