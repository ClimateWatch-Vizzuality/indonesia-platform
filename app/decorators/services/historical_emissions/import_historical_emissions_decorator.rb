HistoricalEmissions::ImportHistoricalEmissions.class_eval do
  headers metadata: [:source, :sector, :subsectorof],
          records: [:geoid, :metric, :unit, :source, :sector, :gas]

  def call
    return unless all_headers_valid?

    ActiveRecord::Base.transaction do
      cleanup
      import_sectors(meta_sectors_csv, HistoricalEmissions.meta_sectors_filepath)
      import_records(data_cait_csv, HistoricalEmissions.data_cait_filepath)
    end
  end

  def all_headers_valid?
    [
      valid_headers?(
        meta_sectors_csv, HistoricalEmissions.meta_sectors_filepath, headers[:metadata]
      ),
      valid_headers?(data_cait_csv, HistoricalEmissions.data_cait_filepath, headers[:records])
    ].all?(true)
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
