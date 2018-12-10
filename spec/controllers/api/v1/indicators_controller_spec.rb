require 'rails_helper'

describe Api::V1::IndicatorsController, type: :controller do
  context do
    let(:ind_pop_total) {
      FactoryBot.create(:indicator, section: 'socioeconomic', code: 'pop_total')
    }
    let(:ind_capacity) {
      FactoryBot.create(:indicator, section: 'energy', code: 'capacity')
    }

    let!(:bali_indicators) do
      location = FactoryBot.create(:location, iso_code3: 'ID.BA')
      FactoryBot.create(
        :indicator_value,
        location: location,
        indicator: ind_pop_total,
        values: {year: '2012', value: 222}
      )
      FactoryBot.create(
        :indicator_value,
        location: location,
        indicator: ind_capacity,
        values: {year: '2012', value: 10}
      )
    end
    let!(:papua_indicators) do
      location = FactoryBot.create(:location, iso_code3: 'ID.PA')
      FactoryBot.create(
        :indicator_value,
        location: location,
        indicator: ind_pop_total,
        values: {year: '2012', value: 100}
      )
      FactoryBot.create(
        :indicator_value,
        location: location,
        indicator: ind_capacity,
        values: {year: '2012', value: 1}
      )
    end

    let(:response_json) { JSON.parse(response.body) }

    describe 'GET index' do
      it 'returns a successful 200 response' do
        get :index, format: :json
        expect(response).to be_successful
      end

      it 'lists all indicators and values' do
        get :index, format: :json
        expect(response_json['indicators'].length).to eq(2)
        expect(response_json['values'].length).to eq(4)
      end

      it 'filters indicator values by location' do
        get :index, params: {location: 'ID.BA'}, format: :json
        expect(response_json['values'].length).to eq(2)
      end

      it 'filters indicators and values by section' do
        get :index, params: {section: 'socioeconomic'}, format: :json
        expect(response_json['indicators'].length).to eq(1)
        expect(response_json['values'].length).to eq(2)
      end

      it 'filters indicators and values by code' do
        get :index, params: {code: 'pop_total'}, format: :json
        expect(response_json['indicators'].length).to eq(1)
        expect(response_json['indicators'][0]['code']).to eq('pop_total')
        expect(response_json['values'].length).to eq(2)
      end
    end
  end
end
