class ImportProvincePlans
  DEV_PLANS_FILEPATH = "#{CW_FILES_PREFIX}province_plans/development_plans.csv".freeze
  CLIMATE_PLANS_FILEPATH = "#{CW_FILES_PREFIX}province_plans/climate_plans.csv".freeze

  DEV_PLAN_SECTOR_PREFIX = 'Supportive Policy Direction in RPJMD:'.freeze

  def call
    cleanup

    load_csv

    import_climate_plans
    import_dev_plans
  end

  private

  def cleanup
    Province::DevelopmentPlan.delete_all
    Province::ClimatePlan.delete_all
  end

  def load_csv
    @climate_plans_csv = S3CSVReader.read(CLIMATE_PLANS_FILEPATH)
    @dev_plans_csv = S3CSVReader.read(
      DEV_PLANS_FILEPATH,
      header_converters: dev_plan_header_converter
    )
  end

  def import_climate_plans
    @climate_plans_csv.each do |row|
      begin
        Province::ClimatePlan.create!(climate_plan_attributes(row))
      rescue ActiveRecord::RecordInvalid => invalid
        STDERR.puts "Error importing #{row.to_s.chomp}: #{invalid}"
      end
    end
  end

  def import_dev_plans
    @dev_plans_csv.each do |row|
      begin
        Province::DevelopmentPlan.create!(dev_plan_attributes(row))
      rescue ActiveRecord::RecordInvalid => invalid
        STDERR.puts "Error importing #{row.to_s.chomp}: #{invalid}"
      end
    end
  end

  def climate_plan_attributes(row)
    {
      location: Location.find_by(iso_code3: row[:geoid]&.gsub(/[[:space:]]/, '')),
      source: row[:source],
      sector: row[:sector],
      sub_sector: row[:subsector],
      mitigation_activities: row[:mitigation_activities].delete('_x005F_x005F_x000D_')
    }
  end

  def dev_plan_attributes(row)
    {
      location: Location.find_by(iso_code3: row[:geoid]&.gsub(/[[:space:]]/, '')),
      source: row[:source],
      rpjmd_period: row[:rpjmd_period],
      supportive_mission_statement: row[:supportive_mission_statement_in_rpjmd],
      supportive_policy_directions: supportive_policy_directions(row)
    }
  end

  def dev_plan_header_converter
    lambda do |h|
      return h if h.downcase.start_with?(DEV_PLAN_SECTOR_PREFIX.downcase)

      CSV::HeaderConverters[:symbol].call(h)
    end
  end

  def supportive_policy_directions(row)
    prefix_regex = /#{DEV_PLAN_SECTOR_PREFIX}/i
    row.headers.grep(prefix_regex).map do |column|
      {sector: column.gsub(prefix_regex, '').strip, value: row[column]}
    end
  end
end
