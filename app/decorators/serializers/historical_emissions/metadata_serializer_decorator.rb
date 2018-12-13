HistoricalEmissions::MetadataSerializer.class_eval do
  attribute :metric

  def sector
    object.sectors.map do |s|
      s.slice(:id, :name).merge(code: sector_code(s))
    end
  end

  def sector_code(sector)
    I18n.with_locale(:en) { Code.create(sector.name) }
  end

  def metric
    object.metrics.map do |m|
      m.slice(:id, :name, :unit).merge(code: metric_code(m))
    end
  end

  def metric_code(metric)
    I18n.with_locale(:en) { Code.create(metric.name) }
  end
end
