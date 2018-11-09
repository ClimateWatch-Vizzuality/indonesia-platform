module EmissionTarget
  class Value < ApplicationRecord
    belongs_to :label, class_name: 'EmissionTarget::Label'
    belongs_to :sector, class_name: 'EmissionTarget::Sector'
    belongs_to :location

    validates :year, presence: true
  end
end
