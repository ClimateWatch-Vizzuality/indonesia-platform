HistoricalEmissions::RecordSerializer.class_eval do
  belongs_to :metric

  def metric
    object.metric.name
  end
end
