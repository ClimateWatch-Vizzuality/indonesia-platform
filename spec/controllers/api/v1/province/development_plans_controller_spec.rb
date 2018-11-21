require 'rails_helper'

describe Api::V1::Province::DevelopmentPlansController, type: :controller do
  context do
    let!(:province_dev_plans) {
      FactoryBot.create_list(:province_development_plan, 3)
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
        expect(parsed_body.length).to eq(3)
      end
    end
  end
end
