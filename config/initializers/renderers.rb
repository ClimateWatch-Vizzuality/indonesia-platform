ActionController::Renderers.add :csv do |obj, options|
  filename = options[:filename] || controller_name
  serializer = options[:serializer]

  object = serializer ? serializer.new(obj) : obj
  str = object.respond_to?(:to_csv) ? object.to_csv : object.to_s

  send_data str, type: Mime[:csv],
            disposition: "attachment; filename=#{filename}.csv"
end
