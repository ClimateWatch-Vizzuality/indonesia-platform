class ImportDataSources
  include ClimateWatchEngine::CSVImporter

  HEADERS = [
    :short_title,
    :title,
    :source_organization,
    :learn_more_link,
    :summary,
    :description,
    :citation,
    :caution
  ].freeze

  DATA_FILEPATH = "#{CW_FILES_PREFIX}metadata/data_sources.csv".freeze

  def call
    return unless valid_headers?(csv, DATA_FILEPATH, HEADERS)

    ActiveRecord::Base.transaction do
      cleanup
      import_data
    end
  end

  private

  def cleanup
    DataSource.delete_all
  end

  def csv
    @csv ||= S3CSVReader.read(DATA_FILEPATH)
  end

  def import_data
    import_each_with_logging(csv, DATA_FILEPATH) do |row|
      DataSource.create!(data_source_attributes(row))
    end
  end

  def data_source_attributes(row)
    {
      short_title: row[:short_title],
      title: row[:title],
      source_organization: row[:source_organization],
      learn_more_link: row[:learn_more_link],
      summary: row[:summary],
      description: row[:description],
      citation: row[:citation],
      caution: row[:caution]
    }
  end
end
