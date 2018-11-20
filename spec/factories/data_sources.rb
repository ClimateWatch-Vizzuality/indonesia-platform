# == Schema Information
#
# Table name: data_sources
#
#  id                  :bigint(8)        not null, primary key
#  caution             :text
#  citation            :text
#  description         :text
#  learn_more_link     :string
#  short_title         :string
#  source_organization :string
#  summary             :text
#  title               :string
#  created_at          :datetime         not null
#  updated_at          :datetime         not null
#
# Indexes
#
#  index_data_sources_on_short_title  (short_title) UNIQUE
#

FactoryBot.define do
  factory :data_source do
    short_title { 'STATIDNa' }
    title { 'Population' }
    description { 'The data of total population' }
    summary { 'Population data 2010-2016' }
    source_organization { 'Central Bureau of Statistics' }
    learn_more_link { 'https://org.org' }
    citation { 'Citation' }
    caution { 'Caution' }
  end
end
