Locations::ImportLocations.class_eval do
  headers :wri_standard_name, :iso_code3, :iso_code2, :location_type, :capital_city

  private

  def import_locations
    import_each_with_logging(csv, Locations.locations_filepath) do |row|
      attributes = {
        iso_code3: iso_code3(row),
        iso_code2: iso_code2(row),
        wri_standard_name: row[:wri_standard_name],
        location_type: row[:location_type] || 'COUNTRY',
        show_in_cw: show_in_cw(row),
        capital_city: row[:capital_city]
      }

      create_or_update(attributes)
    end
  end
end
