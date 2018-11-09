require 'csv'

module GenericToCsv
  extend ActiveSupport::Concern

  def column_values
    self.class.column_attributes.map do |attribute|
      attributes[attribute]
    end
  end

  class_methods do
    def column_attributes
      column_names - ['id']
    end

    def column_headers_override
      {}
    end

    def column_headers
      column_attributes.map do |attribute|
        column_headers_override[attribute] || attribute.humanize
      end
    end

    def to_csv(options = {})
      CSV.generate(options) do |csv|
        csv << column_headers
        all.each do |record|
          csv << record.column_values
        end
      end
    end
  end
end
