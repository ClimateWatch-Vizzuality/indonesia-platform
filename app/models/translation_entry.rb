class TranslationEntry
  include ActiveModel::Model

  attr_accessor :key, :en_value, :id_value

  def save
    ActiveRecord::Base.transaction do
      save_translation(en_value, locale: :en) if en_value.present?
      save_translation(id_value, locale: :id) if id_value.present?
    end
    I18n.backend.reload!

    true
  end

  class << self
    def all
      en_translations = I18n.t('app', locale: :en).flatten_to_root
      id_translations = I18n.t('app', locale: :id).flatten_to_root

      translation_keys_sorted.map do |key|
        TranslationEntry.new(
          key: "app.#{key}",
          en_value: en_translations[key],
          id_value: id_translations[key]
        )
      end
    end

    def find_by(params)
      key = params[:key]&.to_s
      en_value = params[:en_value]&.downcase
      id_value = params[:id_value]&.downcase

      res = all
      res = res.select { |te| te.key.to_s.include?(key) } if key.present?
      res = res.select { |te| te.en_value&.downcase&.include?(en_value) } if en_value.present?
      res = res.select { |te| te.id_value&.downcase&.include?(id_value) } if id_value.present?

      res
    end

    private

    def translation_keys_sorted
      I18n.backend.backends.first.translations[:en][:app].flatten_to_root.keys
    end
  end

  private

  def save_translation(value, locale:)
    t = Translation.find_or_initialize_by(key: key, locale: locale)
    t.value = value
    t.save!
  end
end