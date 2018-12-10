class ImportIndicators
  include ClimateWatchEngine::CSVImporter

  headers indicators: [:indicator, :unit],
          indicator_values: [:geoid, :ind_code, :source],
          adaptation_included: [:geoid, :ind_code, :source, :value]

  INDICATORS_FILEPATH = "#{CW_FILES_PREFIX}indicators/indicators.csv".freeze
  INDICATORS_ID_FILEPATH = "#{CW_FILES_PREFIX}indicators/indicators_id.csv".freeze
  INDICATOR_VALUE_FILEPATHS = %W(
    #{CW_FILES_PREFIX}indicators/socioeconomics.csv
    #{CW_FILES_PREFIX}indicators/pc_forest.csv
    #{CW_FILES_PREFIX}indicators/pc_agriculture.csv
    #{CW_FILES_PREFIX}indicators/pc_energy.csv
    #{CW_FILES_PREFIX}indicators/vulnerability_adaptivity.csv
  ).freeze
  ADAPTATION_INCLUDED_FILEPATH = "#{CW_FILES_PREFIX}indicators/adaptation_included.csv".freeze

  def call
    return unless all_headers_valid?

    ActiveRecord::Base.transaction do
      cleanup

      import_indicators(indicators_csv, INDICATORS_FILEPATH, locale: :en)
      import_indicators(indicators_id_csv, INDICATORS_ID_FILEPATH, locale: :id)
      import_adaptation_included
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
      valid_headers?(indicators_csv, INDICATORS_FILEPATH, headers[:indicators]),
      valid_headers?(indicators_id_csv, INDICATORS_ID_FILEPATH, headers[:indicators]),
      valid_headers?(
        adapt_included_csv, ADAPTATION_INCLUDED_FILEPATH, headers[:adaptation_included]
      ),
      indicator_values_csv_hash.map do |filepath, csv|
        valid_headers?(csv, filepath, headers[:indicator_values])
      end
    ].flatten.all?(true)
  end

  def indicators_csv
    @indicators_csv ||= S3CSVReader.read(INDICATORS_FILEPATH)
  end

  def indicators_id_csv
    @indicators_id_csv ||= S3CSVReader.read(INDICATORS_ID_FILEPATH)
  end

  def adapt_included_csv
    @adapt_included_csv ||= S3CSVReader.read(ADAPTATION_INCLUDED_FILEPATH)
  end

  def indicator_values_csv_hash
    @indicator_values_csv_hash ||= INDICATOR_VALUE_FILEPATHS.reduce({}) do |acc, filepath|
      acc.merge(filepath => S3CSVReader.read(filepath))
    end
  end

  def import_indicators(csv, filepath, locale: I18n.default_locale)
    I18n.with_locale(locale) do
      import_each_with_logging(csv, filepath) do |row|
        indicator = Indicator.find_or_initialize_by(code: row[:ind_code])
        indicator.update_attributes!(
          section: section(row),
          name: row[:indicator],
          unit: row[:unit]
        )
      end
    end
  end

  def import_adaptation_included
    import_each_with_logging(adapt_included_csv, ADAPTATION_INCLUDED_FILEPATH) do |row|
      IndicatorValue.create!(
        location: Location.find_by(iso_code3: row[:geoid]),
        indicator: Indicator.find_by(code: row[:ind_code]),
        source: row[:source],
        values: [{value: row[:value]&.titleize}]
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
