require 'rails_helper'

describe Api::V1::Province::ClimatePlansController, type: :controller do
  context do
    let!(:province_climate_plans) {
      FactoryBot.create_list(:province_climate_plan, 3)
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
          to eq('attachment; filename=climate_plans.csv')
      end

      it 'lists all climate plans' do
        get :index, format: :json
        parsed_body = JSON.parse(response.body)
        expect(parsed_body.length).to eq(3)
      end
    end
  end
end
