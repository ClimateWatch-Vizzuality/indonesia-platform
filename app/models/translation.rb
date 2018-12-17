Translation = I18n::Backend::ActiveRecord::Translation

Translation.class_eval do
  def self.all_with_fallback
    I18n.all('app')
  end
end
