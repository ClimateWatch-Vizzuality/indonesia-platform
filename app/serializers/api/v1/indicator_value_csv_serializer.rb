module Api
  module V1
    class IndicatorValueCSVSerializer
      def initialize(values)
        @values = Array.wrap(values)
      end

      def to_csv
        headers = %w(indicator_code indicator_name category values)

        CSV.generate do |csv|
          csv << headers

          @values.each do |ind_value|
            csv << [
              ind_value.indicator.code,
              ind_value.indicator.name,
              ind_value.category,
              ind_value.values
            ]
          end
        end
      end
    end
  end
end
