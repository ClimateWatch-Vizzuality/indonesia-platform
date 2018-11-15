# == Schema Information
#
# Table name: indicators
#
#  id      :bigint(8)        not null, primary key
#  code    :string           not null
#  name    :string           not null
#  section :string           not null
#  unit    :string           not null
#
# Indexes
#
#  index_indicators_on_code     (code) UNIQUE
#  index_indicators_on_section  (section)
#

class Indicator < ApplicationRecord
  validates_presence_of :name, :code, :section, :unit
  validates :code, uniqueness: true
end
