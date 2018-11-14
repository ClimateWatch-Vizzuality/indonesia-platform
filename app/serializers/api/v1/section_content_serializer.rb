module Api
  module V1
    class SectionContentSerializer < ActiveModel::Serializer
      attributes :slug, :title, :description, :locale
    end
  end
end
