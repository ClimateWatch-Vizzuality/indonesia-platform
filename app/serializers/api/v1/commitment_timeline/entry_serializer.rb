module Api
  module V1
    module CommitmentTimeline
      class EntrySerializer < ActiveModel::Serializer
        attributes :link, :note, :text, :year
      end
    end
  end
end
