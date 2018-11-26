class ImportDataSources
  DATA_FILEPATH = "#{CW_FILES_PREFIX}metadata/data_sources.csv".freeze
  DATA_IDN_FILEPATH = "#{CW_FILES_PREFIX}metadata/data_sources_idn.csv".freeze

  def call
    cleanup
    import_data(S3CSVReader.read(DATA_FILEPATH), locale: :en)
    # import_data(S3CSVReader.read(DATA_IDN_FILEPATH), locale: :idn)
  end

  private

  def cleanup
    DataSource.delete_all
  end

  def import_data(csv, locale:)
    I18n.with_locale(locale) do
      csv.each do |row|
        begin
          data_source = DataSource.find_or_initialize_by(short_title: row[:short_title])
          data_source.update_attributes!(
            title: row[:title],
            source_organization: row[:source_organization],
            learn_more_link: row[:learn_more_link],
            summary: row[:summary],
            description: row[:description],
            citation: row[:citation],
            caution: row[:caution]
          )
        rescue ActiveRecord::RecordInvalid => invalid
          STDERR.puts "Error importing #{row.to_s.chomp}: #{invalid}"
        end
      end
    end
  end
end
