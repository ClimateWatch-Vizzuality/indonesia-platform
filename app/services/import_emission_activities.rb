class ImportEmissionActivities
  DATA_FILEPATH = "#{CW_FILES_PREFIX}emission_activities/emission_activities.csv".freeze

  def call
    cleanup
    load_csv
    import_data
  end

  private

  def cleanup
    EmissionActivity::Value.delete_all
    EmissionActivity::Sector.delete_all
  end

  def load_csv
    @csv = S3CSVReader.read(DATA_FILEPATH)
  end

  def import_data
    @csv.each do |row|
      location = Location.find_by(iso_code3: row[:geoid])

      if location
        EmissionActivity::Value.create!(
          location: location,
          sector: EmissionActivity::Sector.find_or_create_by!(sector_attributes(row)),
          emissions: emissions(row)
        )
      else
        Rails.logger.error "Location #{row[:iso]} not found"
      end
    end
  end

  def sector_attributes(row)
    {
      name: row[:subsector],
      parent: EmissionActivity::Sector.find_or_create_by!(name: row[:sector])
    }
  end

  def emissions(row)
    row.headers.grep(/\d{4}/).map do |year|
      {year: year.to_s.to_i, value: row[year]&.delete(',')&.to_f}
    end
  end
end
