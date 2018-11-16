class ImportIndicators
  INDICATORS_FILEPATH = "#{CW_FILES_PREFIX}indicators/indicators.csv".freeze

  INDICATOR_VALUE_FILEPATHS = %W(
    #{CW_FILES_PREFIX}indicators/socioeconomics.csv
    #{CW_FILES_PREFIX}indicators/pc_forest.csv
    #{CW_FILES_PREFIX}indicators/pc_agriculture.csv
    #{CW_FILES_PREFIX}indicators/pc_energy.csv
    #{CW_FILES_PREFIX}indicators/vulnerability_adaptivity.csv
  ).freeze

  def call
    cleanup

    import_indicators(S3CSVReader.read(INDICATORS_FILEPATH))

    INDICATOR_VALUE_FILEPATHS.each do |filepath|
      import_indicator_values(S3CSVReader.read(filepath))
    end
  end

  private

  def cleanup
    Indicator.delete_all
    IndicatorValue.delete_all
  end

  def import_indicator_values(csv)
    csv.each do |row|
      begin
        IndicatorValue.create!(
          location: Location.find_by(iso_code3: row[:geoid]&.gsub(/[[:space:]]/, '')),
          indicator: Indicator.find_by(code: row[:ind_code]&.gsub(/[[:space:]]/, '')),
          category: row[:category],
          values: values(row)
        )
      rescue ActiveRecord::RecordInvalid => invalid
        STDERR.puts "Error importing #{row.to_s.chomp}: #{invalid}"
      end
    end
  end

  def import_indicators(csv)
    csv.each do |row|
      begin
        Indicator.create!(
          section: section(row),
          code: row[:ind_code],
          name: row[:indicator],
          unit: row[:unit]
        )
      rescue ActiveRecord::RecordInvalid => invalid
        STDERR.puts "Error importing #{row.to_s.chomp}: #{invalid}"
      end
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
      {year: year.to_s, value: row[year]&.delete('%', ',')&.to_f}
    end
  end
end
