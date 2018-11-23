# == Schema Information
#
# Table name: indicators
#
#  id         :bigint(8)        not null, primary key
#  code       :string           not null
#  section    :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
# Indexes
#
#  index_indicators_on_code  (code) UNIQUE
#

class Indicator < ApplicationRecord
  translates :name, :unit

  validates_presence_of :name, :code, :section, :unit
  validates :code, uniqueness: true

  default_scope { includes(:translations) }
end
