require 'rails_helper'

# rubocop disable:LineLength
object_contents = {
  "#{CW_FILES_PREFIX}emission_targets/emission_targets.csv" => <<~END_OF_CSV,
    geoid,Source,Year,Value,Unit,Range,Label,Sector
    ID.BB,RADGRKa,2020,75340,MtCO2e,No,BAU,Total
    ID.BB,RADGRKa,2020,51090,MtCO2e,No,BAU,Agriculture and Forestry
    ID.BB,RADGRKa,2020,24010,MtCO2e,No,BAU,"Energy, Transportation, Industry"
    ID.BE,RADGRKa,2020,12740,MtCO2e,No,BAU,Total
  END_OF_CSV
}
# rubocop enable:LineLength

RSpec.describe ImportEmissionTargets do
  subject { ImportEmissionTargets.new.call }

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
    FactoryBot.create(:location, iso_code3: 'ID.BB')
    FactoryBot.create(:location, iso_code3: 'ID.BE')
  end

  after :all do
    Aws.config[:s3] = {
      stub_responses: nil
    }
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
