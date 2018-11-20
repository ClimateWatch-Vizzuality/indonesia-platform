require 'rails_helper'

describe Api::V1::MetadataController, type: :controller do
  context do
    let!(:data_sources) {
      FactoryBot.create_list(:data_source, 3)
    }

    describe 'GET index' do
      it 'returns a successful 200 response' do
        get :index, format: :json
        expect(response).to be_successful
      end

      it 'lists all data sources' do
        get :index, format: :json
        parsed_body = JSON.parse(response.body)
        expect(parsed_body.length).to eq(3)
      end
    end
  end
end
