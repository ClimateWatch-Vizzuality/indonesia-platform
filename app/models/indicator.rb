# == Schema Information
#
# Table name: indicators
#
#  id           :bigint(8)        not null, primary key
#  code         :string           not null
#  name         :string           not null
#  section      :string           not null
#  translations :jsonb
#  unit         :string
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#
# Indexes
#
#  index_indicators_on_code     (code) UNIQUE
#  index_indicators_on_section  (section)
#

class Indicator < ApplicationRecord
  include Translate

  translates :name

  validates_presence_of :name, :code, :section, :unit
  validates :code, uniqueness: true
end
