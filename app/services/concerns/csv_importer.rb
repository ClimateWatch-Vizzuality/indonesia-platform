module CSVImporter
  extend ActiveSupport::Concern

  included do
    include ActiveModel::Model
  end

  def valid_headers?(csv, filename, headers)
    (headers - csv.headers).each do |value|
      errors.add(:base, :missing_header, msg: "#{filename}: Missing header #{value}", row: 1)
    end.empty?
  end

  def log_errors(filename, row_index)
    yield
  rescue ActiveRecord::RecordInvalid => invalid
    msg = "#{filename}: Error importing row #{r_index}: #{invalid}"
    STDERR.puts msg
    errors.add(:base, :invalid_row, msg: msg, row: row_index)
  end
end
