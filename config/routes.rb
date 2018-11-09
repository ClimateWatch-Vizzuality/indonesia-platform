Rails.application.routes.draw do
  devise_for :admin_users, ActiveAdmin::Devise.config
  ActiveAdmin.routes(self)
  mount Locations::Engine => 'api/v1/locations'
  mount HistoricalEmissions::Engine => 'api/v1'

  namespace :api do
    namespace :v1 do
      resources :emission_targets, only: [:index], defaults: { format: 'json' }
    end
  end

  root 'application#index'
  get '(*frontend)', to: 'application#index'
end
