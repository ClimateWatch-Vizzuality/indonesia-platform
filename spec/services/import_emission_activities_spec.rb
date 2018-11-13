require 'rails_helper'

object_contents = {
  "#{CW_FILES_PREFIX}emission_activities/emission_activities.csv" => <<~END_OF_CSV,
    geoid,Source,Sector,Subsector,2010,2011,2012,2013,2014
    ID.AC,SIGNS,Forestry,non-cropland to cropland,3994.7,2386.15,2123.75,1071.36,
    ID.AC,SIGNS,Forestry,Peat fire,,,,,
    ID.AC,SIGNS,Waste,Landfills,"20,752.49","21,837.04","22,713.70","22,958.87","22,977.31"
    ID.BA,SIGNS,Agriculture,Enteric Fermentation,614.6,574.18,584.08,435.95,499.1
  END_OF_CSV
}

RSpec.describe ImportEmissionActivities do
  subject { ImportEmissionActivities.new.call }

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
  end

  after :all do
    Aws.config[:s3] = {
      stub_responses: nil
    }
  end

  it 'Creates new sector records' do
    expect { subject }.to change { EmissionActivity::Sector.count }.by(7)
  end

  it 'Creates new emission activity values' do
    expect { subject }.to change { EmissionActivity::Value.count }.by(4)
  end
end
