module Translate
  extend ActiveSupport::Concern

  class_methods do
    def translates(*attrs)
      hash_attribute = ->(attr) { attr.is_a?(Hash) }
      i18n_domain = attrs.select(&hash_attribute).reduce({}, &:merge)[:i18n]

      attrs.reject(&hash_attribute).each do |attr_name|
        if i18n_domain.present?
          attr_translations_table(attr_name, i18n_domain)
        else
          attr_translations_column(attr_name)
        end
      end
    end

    private

    def attr_translations_column(attr_name)
      define_method(attr_name) do |locale = I18n.locale|
        return super() if locale == I18n.default_locale

        translations&.dig(locale.to_s, attr_name.to_s) || super()
      end

      define_method("#{attr_name}=") do |value|
        locale = I18n.locale

        return super(value) if locale == I18n.default_locale

        translations = self.translations || {}
        translations[locale.to_s] ||= {}
        translations[locale.to_s][attr_name.to_s] = value

        write_attribute(:translations, translations)

        value
      end
    end

    def attr_translations_table(attr_name, i18n_domain)
      define_method(attr_name) do
        code = Code.create(super())
        key = "#{Translation::DATA_PREFIX}.#{i18n_domain}.#{code}"

        I18n.t(key, default: super())
      end
    end
  end
end
