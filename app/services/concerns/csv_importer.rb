module CSVImporter
  def valid_headers?(csv, filename, headers)
    (headers - csv.headers).each do |value|
      add_error(:missing_header, msg: "#{filename}: Missing header #{value}", row: 1)
    end.empty?
  end

  def errors
    @errors ||= []
  end

  def warnings
    @warnings ||= []
  end

  def add_error(type, details = {})
    msg = details.fetch(:msg, 'Error')
    errors << {type: type, msg: msg}.merge(details.except(:msg))
  end

  def add_warning
    msg = details.fetch(:msg, 'Warning')
    warnings << {type: type, msg: msg}.merge(details.except(:msg))
  end

  def with_logging(filename, row_index)
    yield
  rescue ActiveRecord::RecordInvalid => invalid
    msg = "#{filename}: Error importing row #{row_index}: #{invalid}"
    STDERR.puts msg
    add_warning(:invalid_row, msg: msg, row: row_index, filename: filename)
  end
end
