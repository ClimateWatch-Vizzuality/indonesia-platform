module Api
  module V1
    module CommitmentTimeline
      class EntrySerializer < ActiveModel::Serializer
        attributes :year, :text, :note, :link
      end
    end
  end
end
