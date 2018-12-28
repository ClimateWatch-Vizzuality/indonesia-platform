# == Schema Information
#
# Table name: translations
#
#  id             :bigint(8)        not null, primary key
#  interpolations :text
#  is_proc        :boolean          default(FALSE)
#  key            :string
#  locale         :string
#  value          :text
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#

Translation = I18n::Backend::ActiveRecord::Translation

Translation::DATA_PREFIX = 'app.data'.freeze

Translation.class_eval do
  scope :with_prefix, ->(prefix) { where('key LIKE ?', "#{prefix}%") }
  scope :data_translations, ->(domain = '') { with_prefix("#{Translation::DATA_PREFIX}.#{domain}") }
end
