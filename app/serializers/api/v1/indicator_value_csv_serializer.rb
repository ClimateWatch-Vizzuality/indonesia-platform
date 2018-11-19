module Api
  module V1
    class IndicatorValueCSVSerializer
      def initialize(values)
        @values = Array.wrap(values)
      end

      def to_csv
        year_columns = @values.flat_map(&:values).map { |vh| vh['year'] }.uniq.sort

        headers = %w(source indicator_code indicator_name category).concat(year_columns)

        CSV.generate do |csv|
          csv << headers

          @values.each do |ind_value|
            value_by_year = ind_value.
              values.
              reduce({}) { |acc, v| acc.update(v['year'] => v['value']) }

            csv << [
              ind_value.source,
              ind_value.indicator.code,
              ind_value.indicator.name,
              ind_value.category,
              year_columns.map { |yc| value_by_year[yc] }
            ].flatten
          end
        end
      end
    end
  end
end
