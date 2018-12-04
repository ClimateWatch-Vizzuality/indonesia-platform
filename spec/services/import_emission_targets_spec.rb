require 'rails_helper'

# rubocop disable:LineLength
correct_files = {
  "#{CW_FILES_PREFIX}emission_targets/emission_targets.csv" => <<~END_OF_CSV,
    geoid,Source,Year,Value,Unit,Range,Label,Sector
    ID.BB,RADGRKa,2020,75340,MtCO2e,No,BAU,Total
    ID.BB,RADGRKa,2020,51090,MtCO2e,No,BAU,Agriculture and Forestry
    ID.BB,RADGRKa,2020,24010,MtCO2e,No,BAU,"Energy, Transportation, Industry"
    ID.BE,RADGRKa,2020,12740,MtCO2e,No,BAU,Total
  END_OF_CSV
}
missing_headers_files = {
  "#{CW_FILES_PREFIX}emission_targets/emission_targets.csv" => <<~END_OF_CSV,
    Source,Year,Value,Unit,Range,Label,Sector
    ID.BB,RADGRKa,2020,75340,MtCO2e,No,BAU,Total
  END_OF_CSV
}
missing_locations_files = {
  "#{CW_FILES_PREFIX}emission_targets/emission_targets.csv" => <<~END_OF_CSV,
    geoid,Source,Year,Value,Unit,Range,Label,Sector
    ID.BB,RADGRKa,2020,75340,MtCO2e,No,BAU,Total
    ID.BA,RADGRKa,2020,51090,MtCO2e,No,BAU,Agriculture and Forestry
    ID.BB,RADGRKa,2020,24010,MtCO2e,No,BAU,"Energy, Transportation, Industry"
    ID.BE,RADGRKa,2020,12740,MtCO2e,No,BAU,Total
  END_OF_CSV
}
# rubocop enable:LineLength

RSpec.describe ImportEmissionTargets do
  let(:importer) { ImportEmissionTargets.new }

  before :each do
    FactoryBot.create(:location, iso_code3: 'ID.BB')
    FactoryBot.create(:location, iso_code3: 'ID.BE')
  end

  after :all do
    Aws.config[:s3] = {
      stub_responses: nil
    }
  end

  context 'when file is correct' do
    subject { importer.call }

    before :all do
      stub_with_files(correct_files)
    end

    it 'Creates new label records' do
      expect { subject }.to change { EmissionTarget::Label.count }.by(1)
    end

    it 'Creates new sector records' do
      expect { subject }.to change { EmissionTarget::Sector.count }.by(3)
    end

    it 'Creates new emission target values' do
      expect { subject }.to change { EmissionTarget::Value.count }.by(4)
    end
  end

  context 'when headers are missing' do
    before :all do
      stub_with_files(missing_headers_files)
    end

    it 'does not create any sector' do
      expect { importer.call }.to change { EmissionTarget::Sector.count }.by(0)
    end

    it 'does not create any value' do
      expect { importer.call }.to change { EmissionTarget::Value.count }.by(0)
    end

    it 'has missing headers errors' do
      importer.call
      expect(importer.errors.length).to eq(1)
      expect(importer.errors.first).to include(type: :missing_header)
    end
  end

  context 'when location is missing for one row' do
    before :all do
      stub_with_files(missing_locations_files)
    end

    it 'does not create any value with missing location' do
      expect { importer.call }.to change { EmissionTarget::Value.count }.by(3)
    end

    it 'has errors on row' do
      importer.call
      expect(importer.errors.length).to eq(1)
      expect(importer.errors.first).to include(type: :invalid_row)
    end
  end
end
