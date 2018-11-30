class ImportIndicators
  include ClimateWatchEngine::CSVImporter

  HEADERS = {
    indicators: [:indicator, :unit],
    indicator_values: [:geoid, :ind_code, :category, :source]
  }.freeze

  INDICATORS_FILEPATH = "#{CW_FILES_PREFIX}indicators/indicators.csv".freeze
  INDICATOR_VALUE_FILEPATHS = %W(
    #{CW_FILES_PREFIX}indicators/socioeconomics.csv
    #{CW_FILES_PREFIX}indicators/pc_forest.csv
    #{CW_FILES_PREFIX}indicators/pc_agriculture.csv
    #{CW_FILES_PREFIX}indicators/pc_energy.csv
    #{CW_FILES_PREFIX}indicators/vulnerability_adaptivity.csv
  ).freeze

  def call
    return unless all_headers_valid?

    ActiveRecord::Base.transaction do
      cleanup

      import_indicators(indicators_csv)

      indicator_values_csv_hash.each do |filepath, csv|
        import_indicator_values(csv, filepath)
      end
    end
  end

  private

  def cleanup
    Indicator.delete_all
    IndicatorValue.delete_all
  end

  def all_headers_valid?
    [
      valid_headers?(indicators_csv, INDICATORS_FILEPATH, HEADERS[:indicators]),
      indicator_values_csv_hash.map do |filepath, csv|
        valid_headers?(csv, filepath, HEADERS[:indicator_values])
      end
    ].flatten.all?(true)
  end

  def indicators_csv
    @indicators_csv ||= S3CSVReader.read(INDICATORS_FILEPATH)
  end

  def indicator_values_csv_hash
    @indicator_values_csv_hash ||= INDICATOR_VALUE_FILEPATHS.reduce({}) do |acc, filepath|
      acc.merge(filepath => S3CSVReader.read(filepath))
    end
  end

  def import_indicators(csv)
    import_each_with_logging(csv, INDICATORS_FILEPATH) do |row|
      Indicator.create!(
        section: section(row),
        code: row[:ind_code],
        name: row[:indicator],
        unit: row[:unit]
      )
    end
  end

  def import_indicator_values(csv, filename)
    import_each_with_logging(csv, filename) do |row|
      IndicatorValue.create!(
        location: Location.find_by(iso_code3: row[:geoid]),
        indicator: Indicator.find_by(code: row[:ind_code]),
        category: row[:category],
        source: row[:source],
        values: values(row)
      )
    end
  end

  def section(row)
    section = row[:section]
    if %w(agriculture forestry energy).include?(section)
      'province_circumstances'
    else
      section
    end
  end

  def values(row)
    row.headers.grep(/\d{4}/).map do |year|
      {year: year.to_s, value: row[year]&.delete('%,', ',')&.to_f}
    end
  end
end
