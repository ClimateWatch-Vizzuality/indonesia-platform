HistoricalEmissions::RecordSerializer.class_eval do
  belongs_to :metric

  def metric
    I18n.with_locale(:en) { Code.create(object.metric.name) }
  end

  # def sector
  #   I18n.with_locale(:en) { Code.create(object.sector.name) }
  # end
end
