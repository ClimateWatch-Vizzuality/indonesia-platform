# == Schema Information
#
# Table name: commitment_timeline_entries
#
#  id   :bigint(8)        not null, primary key
#  link :text
#  note :text
#  text :text
#  year :string
#

module CommitmentTimeline
  class Entry < ApplicationRecord
    validates :year, presence: true

    scope :for_current_locale, -> { where(locale: I18n.locale) }
  end
end
