class ImportEmissionTargets
  DATA_FILEPATH = "#{CW_FILES_PREFIX}emission_targets/emission_targets.csv".freeze

  def call
    cleanup
    load_csv
    import_data
  end

  private

  def cleanup
    EmissionTarget::Value.delete_all
    EmissionTarget::Label.delete_all
    EmissionTarget::Sector.delete_all
  end

  def load_csv
    @csv = S3CSVReader.read(DATA_FILEPATH)
  end

  # rubocop:disable MethodLength, AbcSize
  def import_data
    @csv.each do |row|
      location = Location.find_by(iso_code3: row[:geoid])
      label = EmissionTarget::Label.find_or_create_by!(name: row[:label])
      sector = EmissionTarget::Sector.find_or_create_by!(name: row[:sector])
      if location
        if row[:range] == 'Yes'
          value = EmissionTarget::Value.find_or_initialize_by(
            location: location,
            label: label,
            sector: sector,
            year: row[:year],
            first_value: nil
          )

          range = [value.second_value, row[:value].to_f].compact.sort
          range.unshift(nil) if range.size == 1
          value.update!(first_value: range.first, second_value: range.second)
        else
          EmissionTarget::Value.create!(
            location: location,
            label: label,
            sector: sector,
            year: row[:year],
            first_value: row[:value]
          )
        end
      else
        Rails.logger.error "Location #{row[:iso]} not found"
      end
    end
  end
  # rubocop:enable MethodLength, AbcSize
end
