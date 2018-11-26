require 'rails_helper'

object_contents = {
  ImportIndicators::INDICATORS_FILEPATH => <<~END_OF_CSV,
    section,ind_code,indicator,unit
    socioeconomic,pop_total,Population,thousand
    forestry,tree_cover_lost,Tree cover lost,ha
    agriculture,area_harvested,Harvested Area of Paddy,ha
    energy,capacity,Installed capacity,MW
    adaptation,Adap_1,Mineral water sources,index
  END_OF_CSV
  ImportIndicators::INDICATORS_IDN_FILEPATH => <<~END_OF_CSV,
    section,ind_code,indicator,unit
    socioeconomic,pop_total,Population IDN,thousand
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
    source,geoid,ind_code,2010,2011,2012
    STATIDNc,ID.AC,area_harvested,"352,281","380,686","387,803"
  END_OF_CSV
  "#{CW_FILES_PREFIX}indicators/pc_energy.csv" => <<~END_OF_CSV,
    source,geoid,ind_code,category,2011,2012,2013
    STATEL,ID.BA,capacity,diesel power plant,79.3,79.4,79.55
  END_OF_CSV
  "#{CW_FILES_PREFIX}indicators/vulnerability_adaptivity.csv" => <<~END_OF_CSV,
    source,geoid,ind_code,2011,2014
    SIDIK,ID.AC,Adap_1,0.8,0.8
  END_OF_CSV
}

RSpec.describe ImportIndicators do
  subject { ImportIndicators.new.call }

  before :all do
    Aws.config[:s3] = {
      stub_responses: {
        get_object: lambda do |context|
          {body: object_contents[context.params[:key]]}
        end
      }
    }
  end

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

  it 'Creates new indicators' do
    expect { subject }.to change { Indicator.count }.by(5)
  end

  it 'Creates new indicator values' do
    expect { subject }.to change { IndicatorValue.count }.by(5)
  end

  describe 'Imported record' do
    before { subject }

    let(:imported_record) { Indicator.find_by(code: 'pop_total') }

    it 'has english translation' do
      I18n.with_locale(:en) do
        expect(imported_record.name).to eq('Population')
      end
    end

    it 'has indonesian translation' do
      I18n.with_locale(:id) do
        expect(imported_record.name).to eq('Population IDN')
      end
    end
  end
end
