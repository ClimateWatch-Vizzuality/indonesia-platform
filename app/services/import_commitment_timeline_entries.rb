class ImportCommitmentTimelineEntries
  DATA_FILEPATH = "#{CW_FILES_PREFIX}commitment_timeline/commitment_timeline_entries.csv".freeze

  def call
    cleanup
    load_csv
    import_data
  end

  private

  def cleanup
    CommitmentTimeline::Entry.delete_all
  end

  def load_csv
    @csv = S3CSVReader.read(DATA_FILEPATH)
  end

  def import_data
    @csv.each do |row|
      CommitmentTimeline::Entry.create!(
        text: row[:text],
        note: row[:note],
        year: row[:year],
        link: row[:link]
      )
    end
  end
end
