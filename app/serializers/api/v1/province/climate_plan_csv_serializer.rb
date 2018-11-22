module Api
  module V1
    module Province
      class ClimatePlanCSVSerializer
        attr_reader :plans

        def initialize(plans)
          @plans = Array.wrap(plans)
        end

        def to_csv
          headers = %w(
            source location_iso_code location_name sector sub_sector mitigation_activities
          )

          CSV.generate do |csv|
            csv << headers

            plans.each do |plan|
              csv << [
                plan.source,
                plan.location.iso_code3,
                plan.location.wri_standard_name,
                plan.sector,
                plan.sub_sector,
                plan.mitigation_activities
              ]
            end
          end
        end
      end
    end
  end
end
