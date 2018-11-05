class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception

  def index
    @is_production = Rails.env.production?
  end
end
