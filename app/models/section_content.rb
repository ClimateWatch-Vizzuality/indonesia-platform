# == Schema Information
#
# Table name: section_contents
#
#  id          :bigint(8)        not null, primary key
#  description :text
#  locale      :string
#  name        :string
#  order       :integer
#  slug        :string
#  title       :string
#  created_at  :datetime
#  updated_at  :datetime
#

class SectionContent < ApplicationRecord
  scope :by_current_locale, -> { where(locale: I18n.locale) }
end
