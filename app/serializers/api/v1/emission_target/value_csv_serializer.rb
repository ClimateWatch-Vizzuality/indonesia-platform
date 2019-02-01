module Api
  module V1
    module EmissionTarget
      class ValueCSVSerializer
        def initialize(values)
          @values = Array.wrap(values)
        end

        def to_csv
          headers = %w(
            source location_code location_name year first_value second_value unit label sector
          )

          CSV.generate do |csv|
            csv << headers

            @values.each do |value|
              csv << [
                value.source,
                value.location.iso_code3,
                value.location.wri_standard_name,
                value.year,
                value.first_value,
                value.second_value,
                value.unit,
                value.label&.name,
                value.sector&.name
              ]
            end
          end
        end
      end
    end
  end
end
