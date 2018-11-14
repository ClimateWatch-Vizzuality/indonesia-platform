require 'rails_helper'

describe Api::V1::CommitmentTimelineEntriesController, type: :controller do
  context do
    let!(:timeline_entries) {
      FactoryBot.create_list(:commitment_timeline_entry, 3)
    }

    describe 'GET index' do
      it 'returns a successful 200 response' do
        get :index
        expect(response).to be_successful
      end

      it 'lists all commitment timeline entries' do
        get :index
        parsed_body = JSON.parse(response.body)
        expect(parsed_body.length).to eq(3)
      end
    end
  end
end
