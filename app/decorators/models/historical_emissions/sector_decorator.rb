HistoricalEmissions::Sector.class_eval do
  include Translate

  translates :name, i18n: :sector

  def code
    Code.create(read_attribute(:name))
  end
end
