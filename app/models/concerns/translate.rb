module Translate
  extend ActiveSupport::Concern

  class_methods do
    attr_accessor :translated_attributes

    def translates(*attrs)
      self.translated_attributes = attrs

      attrs.each do |attr_name|
        define_method(attr_name) do |locale = I18n.locale|
          hash = read_attribute(attr_name)
          hash[locale.to_s] || hash[I18n.default_locale.to_s]
        end

        define_method("#{attr_name}=") do |value|
          hash = read_attribute(attr_name) || {}
          hash[I18n.locale.to_s] = value
          write_attribute(attr_name, hash)

          value
        end
      end
    end
  end
end
