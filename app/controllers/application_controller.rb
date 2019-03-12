class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception

  unless Rails.env.development?
    http_basic_authenticate_with name: ENV['HTTP_AUTH_USERNAME'],
      password: ENV['HTTP_AUTH_PASSWORD']
  end

  def index
    @is_production = Rails.env.production?
  end
end
