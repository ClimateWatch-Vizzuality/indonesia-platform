class ImportCommitmentTimelineEntries
  include ClimateWatchEngine::CSVImporter

  HEADERS = [:text, :note, :year, :link].freeze

  DATA_FILEPATH = "#{CW_FILES_PREFIX}commitment_timeline/commitment_timeline_entries.csv".freeze

  def call
    return unless valid_headers?(csv, DATA_FILEPATH, HEADERS)

    ActiveRecord::Base.transaction do
      cleanup
      import_data
    end
  end

  private

  def cleanup
    CommitmentTimeline::Entry.delete_all
  end

  def csv
    @csv ||= S3CSVReader.read(DATA_FILEPATH)
  end

  def import_data
    import_each_with_logging(csv, DATA_FILEPATH) do |row|
      CommitmentTimeline::Entry.create!(
        text: row[:text],
        note: row[:note],
        year: row[:year],
        link: row[:link]
      )
    end
  end
end
