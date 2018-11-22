require 'rails_helper'

describe Api::V1::Province::DevelopmentPlansController, type: :controller do
  context do
    let!(:bali_plans) {
      location = FactoryBot.create(:location, iso_code3: 'ID.BA')
      FactoryBot.create_list(:province_development_plan, 2, location: location)
    }
    let!(:papua_plans) {
      location = FactoryBot.create(:location, iso_code3: 'ID.PA')
      FactoryBot.create_list(:province_development_plan, 3, location: location)
    }

    describe 'GET index' do
      it 'returns a successful 200 response' do
        get :index, format: :json
        expect(response).to be_successful
      end

      it 'responds to csv' do
        get :index, format: :csv
        expect(response.content_type).to eq('text/csv')
        expect(response.headers['Content-Disposition']).
          to eq('attachment; filename=development_plans.csv')
      end

      it 'lists all development plans' do
        get :index, format: :json
        parsed_body = JSON.parse(response.body)
        expect(parsed_body.length).to eq(5)
      end

      it 'filters by location' do
        get :index, params: {location: 'ID.BA'}, format: :json
        parsed_body = JSON.parse(response.body)
        expect(parsed_body.length).to eq(2)
      end
    end
  end
end
