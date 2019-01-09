Dir[Rails.root.join('app', 'lib', 'extensions', '**', '*.rb')].each { |f| require f }
