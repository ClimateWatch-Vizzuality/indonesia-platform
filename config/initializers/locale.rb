require 'i18n/backend/active_record'

I18n.load_path += Dir[Rails.root.join("config", "locales", "**", "*.{rb,yml}")]
I18n.available_locales = [:en, :id]
I18n.default_locale = :en
I18n.fallbacks = { :id => :en }

module I18n
  class << self
    def all(key_prefix)
      return t(key_prefix) unless defined? fallbacks

      fallbacks[I18n.locale].reverse.reduce({}) do |translations, fallback|
        translations.deep_merge!(backend.translate(fallback, key_prefix))
      end
    end
  end
end

begin
  if Translation.table_exists?
    I18n.backend = I18n::Backend::ActiveRecord.new

    I18n::Backend::ActiveRecord.send(:include, I18n::Backend::Memoize)
    I18n::Backend::Simple.send(:include, I18n::Backend::Memoize)
    I18n::Backend::Simple.send(:include, I18n::Backend::Pluralization)

    I18n.backend = I18n::Backend::Chain.new(I18n.backend, I18n::Backend::Simple.new)
  end
rescue PG::ConnectionBad
  puts "Database not connected - not initializing I18n backend"
end
