require 'rails_helper'

describe Api::V1::EmissionTargetsController, type: :controller do
  context do
    let!(:bali_targets) {
      location = FactoryBot.create(:location, iso_code3: 'ID.BA')
      FactoryBot.create_list(:emission_target_value, 2, location: location)
    }
    let!(:papua_targets) {
      location = FactoryBot.create(:location, iso_code3: 'ID.PA')
      FactoryBot.create_list(:emission_target_value, 3, location: location)
    }

    describe 'GET index' do
      it 'returns a successful 200 response' do
        get :index, format: :json
        expect(response).to be_successful
      end

      it 'lists all emission target values' do
        get :index, format: :json
        parsed_body = JSON.parse(response.body)
        expect(parsed_body.length).to eq(5)
      end

      it 'filters emission target values by location' do
        get :index, params: {location: 'ID.BA'}, format: :json
        parsed_body = JSON.parse(response.body)
        expect(parsed_body.length).to eq(2)
      end

      it 'responds to zip' do
        get :index, format: :zip
        expect(response.content_type).to eq('application/zip')
      end
    end
  end
end
