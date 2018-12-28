# == Schema Information
#
# Table name: indicator_categories
#
#  id           :bigint(8)        not null, primary key
#  name         :text             not null
#  translations :jsonb
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#
# Indexes
#
#  index_indicator_categories_on_name  (name) UNIQUE
#

class IndicatorCategory < ApplicationRecord
  include Translate

  translates :name, i18n: :value_category

  validates :name, presence: true, uniqueness: true

  def code
    Code.create(read_attribute(:name))
  end
end
