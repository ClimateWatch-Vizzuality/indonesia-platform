module Translate
  extend ActiveSupport::Concern

  class_methods do
    def translates(*attrs)
      attrs.each do |attr_name|
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
    end
  end
end
