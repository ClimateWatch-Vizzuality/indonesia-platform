require 'rails_helper'

correct_files = {
  "#{CW_FILES_PREFIX}indicators/indicators.csv" => <<~END_OF_CSV,
    section,ind_code,indicator,unit
    socioeconomic,pop_total,Population,thousand
    forestry,tree_cover_lost,Tree cover lost,ha
    agriculture,area_harvested,Harvested Area of Paddy,ha
    energy,capacity,Installed capacity,MW
    adaptation,Adap_1,Mineral water sources,index
    adaptation,Adap_13,Adaptation included,text
  END_OF_CSV
  ImportIndicators::INDICATORS_ID_FILEPATH => <<~END_OF_CSV,
    section,ind_code,indicator
    socioeconomic,pop_total,Population IDN
  END_OF_CSV
  "#{CW_FILES_PREFIX}indicators/socioeconomics.csv" => <<~END_OF_CSV,
    geoid,source,ind_code,category,2010,2011
    IDN,STATIDNa,pop_total,238500,242000
  END_OF_CSV
  "#{CW_FILES_PREFIX}indicators/pc_forest.csv" => <<~END_OF_CSV,
    source,geoid,ind_code,category,"1990 -1996","1996 - 2000"
    ,ID.AC,tree_cover_lost,non peat,,303973.8169
  END_OF_CSV
  "#{CW_FILES_PREFIX}indicators/pc_agriculture.csv" => <<~END_OF_CSV,
    source,geoid,category,ind_code,2010,2011,2012
    STATIDNc,ID.AC,,area_harvested,"352,281","380,686","387,803"
  END_OF_CSV
  "#{CW_FILES_PREFIX}indicators/pc_energy.csv" => <<~END_OF_CSV,
    source,geoid,ind_code,category,2011,2012,2013
    STATEL,ID.BA,capacity,diesel power plant,79.3,79.4,79.55
  END_OF_CSV
  "#{CW_FILES_PREFIX}indicators/vulnerability_adaptivity.csv" => <<~END_OF_CSV,
    source,geoid,ind_code,category,2011,2014
    SIDIK,ID.AC,Adap_1,0.8,0.8
  END_OF_CSV
  "#{CW_FILES_PREFIX}indicators/adaptation_included.csv" => <<~END_OF_CSV,
    Source,geoid,ind_code,value
    CAITIDNa,ID.AC,Adap_13,No
    CAITIDNa,ID.BA,Adap_13,Yes
  END_OF_CSV
}
missing_headers_files = correct_files.merge(
  "#{CW_FILES_PREFIX}indicators/socioeconomics.csv" => <<~END_OF_CSV,
    source,ind_code,category,2010,2011
    IDN,STATIDNa,pop_total,238500,242000
  END_OF_CSV
)
missing_locations_files = correct_files.merge(
  "#{CW_FILES_PREFIX}indicators/pc_energy.csv" => <<~END_OF_CSV,
    source,geoid,ind_code,category,2011,2012,2013
    STATEL,ID.AA,capacity,diesel power plant,79.3,79.4,79.55
  END_OF_CSV
)

RSpec.describe ImportIndicators do
  let(:importer) { ImportIndicators.new }

  before :each do
    FactoryBot.create(:location, iso_code3: 'ID.AC')
    FactoryBot.create(:location, iso_code3: 'ID.BA')
    FactoryBot.create(:location, iso_code3: 'IDN')
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

    it 'importer has no errors' do
      subject
      expect(importer.errors).to be_empty
    end

    it 'Creates new indicators' do
      expect { subject }.to change { Indicator.count }.by(6)
    end

    it 'Creates new indicator values' do
      expect { subject }.to change { IndicatorValue.count }.by(7)
    end

    describe 'Imported record' do
      before { importer.call }

      subject { Indicator.find_by(code: 'pop_total') }

      it 'has english translation' do
        I18n.with_locale(:en) do
          expect(subject.name).to eq('Population')
        end
      end

      it 'has indonesian translation' do
        I18n.with_locale(:id) do
          expect(subject.name).to eq('Population IDN')
        end
      end
    end
  end

  context 'when headers are missing' do
    before :all do
      stub_with_files(missing_headers_files)
    end

    it 'does not create any indicator' do
      expect { importer.call }.to change { Indicator.count }.by(0)
    end

    it 'does not create any indicator value' do
      expect { importer.call }.to change { IndicatorValue.count }.by(0)
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

    it 'does not create any indicator value with missing location' do
      expect { importer.call }.to change { IndicatorValue.count }.by(6)
    end

    it 'has errors on row' do
      importer.call
      expect(importer.errors.length).to eq(1)
      expect(importer.errors.first).to include(type: :invalid_row)
    end
  end
end
