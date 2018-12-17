# == Schema Information
#
# Table name: emission_activity_sectors
#
#  id           :bigint(8)        not null, primary key
#  name         :text
#  translations :jsonb
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#  parent_id    :bigint(8)
#
# Indexes
#
#  index_emission_activity_sectors_on_name_and_parent_id  (name,parent_id) UNIQUE
#  index_emission_activity_sectors_on_parent_id           (parent_id)
#
# Foreign Keys
#
#  fk_rails_...  (parent_id => emission_activity_sectors.id) ON DELETE => cascade
#

module EmissionActivity
  class Sector < ApplicationRecord
    include Translate

    translates :name

    belongs_to :parent,
               class_name: 'EmissionActivity::Sector',
               foreign_key: 'parent_id',
               required: false

    validates :name, presence: true, uniqueness: {scope: :parent}
  end
end
