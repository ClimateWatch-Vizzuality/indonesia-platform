HistoricalEmissions::MetadataSerializer.class_eval do
  attribute :metric

  def sector
    object.sectors.map do |s|
      s.slice(:id, :name, :code)
    end
  end

  def metric
    object.metrics.map do |m|
      m.slice(:id, :name, :unit, :code)
    end
  end

  def gas
    object.gases.map do |m|
      m.slice(:id, :name, :code)
    end
  end
end
