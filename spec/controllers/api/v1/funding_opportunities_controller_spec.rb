require 'rails_helper'

describe Api::V1::FundingOpportunitiesController, type: :controller do
  context do
    let!(:opportunities) {
      FactoryBot.create_list(:funding_opportunity, 3)
    }

    describe 'GET index' do
      it 'returns a successful 200 response' do
        get :index, format: :json
        expect(response).to be_successful
      end

      it 'lists all opportunities' do
        get :index, format: :json
        parsed_body = JSON.parse(response.body)
        expect(parsed_body.length).to eq(3)
      end

      it 'responds to zip' do
        get :index, format: :zip
        expect(response.content_type).to eq('application/zip')
      end
    end
  end
end
