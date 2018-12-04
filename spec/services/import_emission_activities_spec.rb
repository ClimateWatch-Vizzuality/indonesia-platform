require 'rails_helper'

correct_files = {
  "#{CW_FILES_PREFIX}emission_activities/emission_activities.csv" => <<~END_OF_CSV,
    geoid,Source,Sector,Subsector,2010,2011,2012,2013,2014
    ID.AC,SIGNS,Forestry,non-cropland to cropland,3994.7,2386.15,2123.75,1071.36,
    ID.AC,SIGNS,Forestry,Peat fire,,,,,
    ID.AC,SIGNS,Waste,Landfills,"20,752.49","21,837.04","22,713.70","22,958.87","22,977.31"
    ID.BA,SIGNS,Agriculture,Enteric Fermentation,614.6,574.18,584.08,435.95,499.1
  END_OF_CSV
}
missing_headers_files = {
  "#{CW_FILES_PREFIX}emission_activities/emission_activities.csv" => <<~END_OF_CSV,
    Source,Sector,Subsector,2010,2011,2012,2013,2014
    ID.AC,SIGNS,Forestry,non-cropland to cropland,3994.7,2386.15,2123.75,1071.36,
  END_OF_CSV
}
missing_locations_files = {
  "#{CW_FILES_PREFIX}emission_activities/emission_activities.csv" => <<~END_OF_CSV,
    geoid,Source,Sector,Subsector,2010,2011,2012,2013,2014
    ID.CC,SIGNS,Forestry,non-cropland to cropland,3994.7,2386.15,2123.75,1071.36,
    ID.AC,SIGNS,Forestry,Peat fire,,,,,
    ID.AC,SIGNS,Waste,Landfills,"20,752.49","21,837.04","22,713.70","22,958.87","22,977.31"
    ID.BA,SIGNS,Agriculture,Enteric Fermentation,614.6,574.18,584.08,435.95,499.1
  END_OF_CSV
}

RSpec.describe ImportEmissionActivities do
  let(:importer) { ImportEmissionActivities.new }

  before :each do
    FactoryBot.create(:location, iso_code3: 'ID.AC')
    FactoryBot.create(:location, iso_code3: 'ID.BA')
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

    it 'Creates new sector records' do
      expect { subject }.to change { EmissionActivity::Sector.count }.by(7)
    end

    it 'Creates new emission activity values' do
      expect { subject }.to change { EmissionActivity::Value.count }.by(4)
    end
  end


  context 'when headers are missing' do
    before :all do
      stub_with_files(missing_headers_files)
    end

    it 'does not create any sector' do
      expect { importer.call }.to change { EmissionActivity::Sector.count }.by(0)
    end

    it 'does not create any value' do
      expect { importer.call }.to change { EmissionActivity::Value.count }.by(0)
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
      expect { importer.call }.to change { EmissionActivity::Value.count }.by(3)
    end

    it 'has errors on row' do
      importer.call
      expect(importer.errors.length).to eq(1)
      expect(importer.errors.first).to include(type: :invalid_row)
    end
  end
end
