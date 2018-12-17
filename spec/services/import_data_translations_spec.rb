require 'rails_helper'

correct_files = {
  ImportDataTranslations::DATA_FILEPATH => <<~END_OF_CSV,
    domain,name_en,name_id
    value_category,ind_cat,ind_cat_id
    sector,em_sector,em_sector_id
    sector,he_sector,he_sector_id
    sector,et_sector,et_sector_id
    metric,metric,metric_id
    gas,gas,gas_id
  END_OF_CSV
}
missing_headers_files = {
  ImportDataTranslations::DATA_FILEPATH => <<~END_OF_CSV,
    name_en,name_id
    sector,em_sector,em_sector_id
    sector,he_sector,he_sector_id
  END_OF_CSV
}

RSpec.describe ImportDataTranslations do
  let(:importer) { ImportDataTranslations.new }

  after :all do
    Aws.config[:s3] = {
      stub_responses: nil
    }
  end

  context 'when file is correct' do
    before :all do
      stub_with_files(correct_files)
    end

    before :each do
      FactoryBot.create(:indicator_category, name: 'ind_cat')
      FactoryBot.create(:emission_activity_sector, name: 'em_sector')
      FactoryBot.create(:emission_target_sector, name: 'et_sector')
      FactoryBot.create(:historical_emissions_sector, name: 'he_sector')
      FactoryBot.create(:historical_emissions_metric, name: 'metric')
      FactoryBot.create(:historical_emissions_gas, name: 'gas')
      importer.call
    end

    it 'translates categories' do
      cat = IndicatorCategory.find_by(name: 'ind_cat')
      I18n.with_locale(:id) do
        expect(cat.name).to eq('ind_cat_id')
      end
    end

    it 'translates emission activites sectors' do
      sector = EmissionActivity::Sector.find_by(name: 'em_sector')
      I18n.with_locale :id do
        expect(sector.name).to eq('em_sector_id')
      end
    end

    it 'translates emission target sectors' do
      sector = EmissionTarget::Sector.find_by(name: 'et_sector')
      I18n.with_locale :id do
        expect(sector.name).to eq('et_sector_id')
      end
    end

    it 'translates historical emissions sectors' do
      sector = HistoricalEmissions::Sector.find_by(name: 'he_sector')
      I18n.with_locale :id do
        expect(sector.name).to eq('he_sector_id')
      end
    end

    it 'translates historical emissions metrics' do
      metric = HistoricalEmissions::Metric.find_by(name: 'metric')
      I18n.with_locale :id do
        expect(metric.name).to eq('metric_id')
      end
    end

    it 'translates historical emissions gases' do
      gas = HistoricalEmissions::Gas.find_by(name: 'gas')
      I18n.with_locale :id do
        expect(gas.name).to eq('gas_id')
      end
    end
  end

  context 'when headers are missing' do
    before :all do
      stub_with_files(missing_headers_files)
    end

    it 'has missing headers errors' do
      importer.call
      expect(importer.errors.length).to eq(1)
      expect(importer.errors.first).to include(type: :missing_header)
    end
  end
end
