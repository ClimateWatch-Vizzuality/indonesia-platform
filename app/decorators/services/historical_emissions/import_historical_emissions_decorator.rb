HistoricalEmissions::ImportHistoricalEmissions.class_eval do
  def call
    cleanup
    import_sectors(S3CSVReader.read(HistoricalEmissions.meta_sectors_filepath))
    import_records(S3CSVReader.read(HistoricalEmissions.data_cait_filepath))
  end

  def record_attributes(row)
    {
      location: Location.find_by(iso_code3: row[:geoid]),
      data_source: HistoricalEmissions::DataSource.find_by(name: row[:source]),
      sector: HistoricalEmissions::Sector.find_by(name: row[:sector]),
      gas: HistoricalEmissions::Gas.find_or_create_by(name: row[:gas]),
      gwp: HistoricalEmissions::Gwp.find_or_create_by(name: 'AR2'),
      metric: HistoricalEmissions::Metric.find_or_create_by(name: row[:metric], unit: row[:unit]),
      emissions: emissions(row)
    }
  end
end
