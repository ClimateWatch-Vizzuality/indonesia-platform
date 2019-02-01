module Api
  module V1
    module Province
      class DevelopmentPlanCSVSerializer
        attr_reader :plans

        def initialize(plans)
          @plans = Array.wrap(plans)
        end

        def to_csv
          headers = %w(
            source location_iso_code location_name rpjmd_period supportive_mission_statement
          )
          headers.concat(uniq_sectors.map { |s| "suportive policy direction: #{s}" })

          CSV.generate do |csv|
            csv << headers

            plans.each do |plan|
              policy_by_sector = plan.
                supportive_policy_directions&.
                reduce({}) { |acc, v| acc.update(v['sector'] => v['value']) } || {}

              csv << [
                plan.source,
                plan.location.iso_code3,
                plan.location.wri_standard_name,
                plan.rpjmd_period,
                plan.supportive_mission_statement,
                uniq_sectors.map { |sector| policy_by_sector[sector] }
              ].flatten
            end
          end
        end

        private

        def uniq_sectors
          @uniq_sectors ||= plans.
            flat_map(&:supportive_policy_directions).
            map { |vh| vh && vh['sector'] }.
            uniq.
            sort
        end
      end
    end
  end
end
