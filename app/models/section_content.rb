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
  def self.by_current_locale
    return by_default_locale if I18n.locale == I18n.default_locale

    sql = <<-SQL
      SELECT
        COALESCE(sc.title, dsc.title) as "title",
        COALESCE(sc.description, dsc.description) as "description",
        dsc.name,
        dsc.slug,
        dsc.order,
        COALESCE(sc.locale, dsc.locale) as "locale"
      FROM
        section_contents dsc
        LEFT JOIN section_contents sc ON sc.slug = dsc.slug
      WHERE dsc.locale = ? AND sc.locale = ?
    SQL

    find_by_sql([sql, I18n.default_locale, I18n.locale])
  end

  def self.by_default_locale
    where(locale: I18n.default_locale)
  end
end
