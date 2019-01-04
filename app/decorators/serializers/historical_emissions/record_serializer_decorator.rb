HistoricalEmissions::RecordSerializer.class_eval do
  belongs_to :metric

  def metric
    object.metric.code
  end

  def sector
    object.sector.code
  end

  def gas
    object.gas.code
  end
end
