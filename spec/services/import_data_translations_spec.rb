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

    subject { importer.call }

    it 'creates new sector translations' do
      expect { subject }.to change { Translation.data_translations('sector').count }.by(6)
    end

    it 'creates new metric translations' do
      expect { subject }.to change { Translation.data_translations('metric').count }.by(2)
    end

    it 'creates new value category translations' do
      expect { subject }.to change { Translation.data_translations('value_category').count }.by(2)
    end

    it 'creates new gas translations' do
      expect { subject }.to change { Translation.data_translations('gas').count }.by(2)
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
