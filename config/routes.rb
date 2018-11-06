Rails.application.routes.draw do
  mount Locations::Engine => 'api/v1/locations'
  mount HistoricalEmissions::Engine => 'api/v1'

  root 'application#index'
  get '(*frontend)', to: 'application#index'
end
