HistoricalEmissions::Gas.class_eval do
  include Translate

  translates :name, i18n: :gas

  def code
    Code.create(read_attribute(:name))
  end
end
