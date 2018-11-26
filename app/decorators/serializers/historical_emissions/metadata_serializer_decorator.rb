HistoricalEmissions::MetadataSerializer.class_eval do
  attribute :metric

  def metric
    object.metrics.map do |m|
      m.slice(:id, :name, :unit)
    end
  end
end
