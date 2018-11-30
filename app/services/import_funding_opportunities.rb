class ImportFundingOpportunities
  include ClimateWatchEngine::CSVImporter

  HEADERS = [
    :source, :project_name, :mode_of_support, :sectors_and_topics,
    :application_procedure, :website_link, :last_update_web
  ].freeze

  DATA_FILEPATH = "#{CW_FILES_PREFIX}funding/opportunities.csv".freeze

  def call
    return unless valid_headers?(csv, DATA_FILEPATH, HEADERS)

    ActiveRecord::Base.transaction do
      cleanup
      import_data
    end
  end

  private

  def cleanup
    Funding::Opportunity.delete_all
  end

  def csv
    @csv ||= S3CSVReader.read(DATA_FILEPATH)
  end

  def import_data
    import_each_with_logging(csv, DATA_FILEPATH) do |row|
      Funding::Opportunity.create!(opportunity_attributes(row))
    end
  end

  def opportunity_attributes(row)
    {
      source: row[:source],
      project_name: row[:project_name],
      mode_of_support: row[:mode_of_support],
      sectors_and_topics: row[:sectors_and_topics],
      description: row[:description],
      application_procedure: row[:application_procedure],
      website_link: row[:website_link],
      last_update_year: row[:last_update_web]
    }
  end
end
