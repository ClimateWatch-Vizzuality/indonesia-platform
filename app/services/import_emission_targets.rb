class ImportEmissionTargets
  include ClimateWatchEngine::CSVImporter

  HEADERS = [:geoid, :label, :sector, :value, :range, :year].freeze

  DATA_FILEPATH = "#{CW_FILES_PREFIX}emission_targets/emission_targets.csv".freeze

  def call
    return unless valid_headers?(csv, DATA_FILEPATH, HEADERS)

    ActiveRecord::Base.transaction do
      cleanup
      import_data
    end
  end

  private

  def cleanup
    EmissionTarget::Value.delete_all
    EmissionTarget::Label.delete_all
    EmissionTarget::Sector.delete_all
  end

  def csv
    @csv ||= S3CSVReader.read(DATA_FILEPATH)
  end

  # rubocop:disable MethodLength, AbcSize
  def import_data
    import_each_with_logging(csv, DATA_FILEPATH) do |row|
      location = Location.find_by(iso_code3: row[:geoid])
      label = EmissionTarget::Label.find_or_create_by!(name: row[:label])
      sector = EmissionTarget::Sector.find_or_create_by!(name: row[:sector])
      row_value = row[:value].delete(',').to_f

      if row[:range] == 'Yes'
        value = EmissionTarget::Value.find_or_initialize_by(
          location: location,
          label: label,
          sector: sector,
          year: row[:year],
          first_value: nil
        )

        range = [value.second_value, row_value].compact.sort
        range.unshift(nil) if range.size == 1
        value.update!(first_value: range.first, second_value: range.second)
      else
        EmissionTarget::Value.create!(
          location: location,
          label: label,
          sector: sector,
          year: row[:year],
          first_value: row_value
        )
      end
    end
  end
  # rubocop:enable MethodLength, AbcSize
end
