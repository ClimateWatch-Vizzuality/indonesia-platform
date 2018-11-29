class ImportIndicators
  include CSVImporter

  CSVFile = Struct.new(:rows, :filename)

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

      import_indicators(indicators_file)

      indicator_values_files.each do |csv|
        import_indicator_values(csv)
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
      valid_headers?(indicators_file.rows, indicators_file.filename, HEADERS[:indicators]),
      indicator_values_files.map do |csv|
        valid_headers?(csv.rows, csv.filename, HEADERS[:indicator_values])
      end
    ].flatten.all?(true)
  end

  def indicators_file
    @indicators_file ||= CSVFile.new(
      S3CSVReader.read(INDICATORS_FILEPATH),
      File.basename(INDICATORS_FILEPATH)
    )
  end

  def indicator_values_files
    @indicator_values_files ||= INDICATOR_VALUE_FILEPATHS.map do |filepath|
      CSVFile.new(S3CSVReader.read(filepath), File.basename(filepath))
    end
  end

  def import_indicators(csv)
    csv.rows.each.with_index(1) do |row, row_index|
      log_errors(csv.filename, row_index) do
        Indicator.create!(
          section: section(row),
          code: row[:ind_code],
          name: row[:indicator],
          unit: row[:unit]
        )
      end
    end
  end

  def import_indicator_values(csv)
    csv.rows.each.with_index(1) do |row, row_index|
      log_errors(csv.filename, row_index) do
        IndicatorValue.create!(
          location: Location.find_by(iso_code3: row[:geoid]),
          indicator: Indicator.find_by(code: row[:ind_code]),
          category: row[:category],
          source: row[:source],
          values: values(row)
        )
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
      {year: year.to_s, value: row[year]&.delete('%,', ',')&.to_f}
    end
  end
end
