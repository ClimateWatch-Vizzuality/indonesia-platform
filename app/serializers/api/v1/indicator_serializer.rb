module Api
  module V1
    class IndicatorSerializer < ActiveModel::Serializer
      attributes :section, :code, :name, :unit
    end
  end
end
