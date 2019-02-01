require 'zip'

ActionController::Renderers.add :csv do |obj, options|
  filename = options[:filename] || controller_name
  serializer = options[:serializer]

  object = serializer ? serializer.new(obj) : obj
  str = object.respond_to?(:to_csv) ? object.to_csv : object.to_s

  send_data str, type: Mime[:csv],
            disposition: "attachment; filename=#{filename}.csv"
end

ActionController::Renderers.add :zip do |files, options|
  filename = options[:filename] || controller_name

  zipped_csv = Zip::OutputStream.write_buffer do |zos|
    files.each do |filename, content|
      zos.put_next_entry filename
      zos.print content
    end
  end
  zipped_csv.rewind

  send_data zipped_csv.read,
            type: Mime[:zip],
            disposition: "attachment; filename=#{filename}.zip"
end
