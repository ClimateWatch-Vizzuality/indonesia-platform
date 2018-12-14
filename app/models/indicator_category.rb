class IndicatorCategory < ApplicationRecord
  include Translate

  translates :name

  validates :name, presence: true, uniqueness: true
end
