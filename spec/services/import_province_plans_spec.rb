require 'rails_helper'

object_contents = {
  ImportProvincePlans::DEV_PLANS_FILEPATH => <<~END_OF_CSV,
    Source,geoid,RPJMD Period,Supportive Mission statement in RPJMD,"Supportive Policy Direction in RPJMD: Agriculture and Forestry","Supportive Policy direction in RPJMD: Energy, Transport, and Industry",Supportive Policy direction in RPJMD: Waste
    RPJMD,ID.AC,2012-2017,mission statement,policy direction af, policy direction en,policy direction waste
    RPJMD,ID.BA,2012-2017,mission statement,policy direction af, policy direction en,policy direction waste
  END_OF_CSV
  ImportProvincePlans::CLIMATE_PLANS_FILEPATH => <<~END_OF_CSV,
    Source,geoid,Sector,Subsector,Mitigation Activities
    RADGRKb,ID.AC,Agriculture,subsector,mitigation activities for id.ac
    RADGRKb,ID.BA,Forest,subsector,mitigation activities for id.ba
  END_OF_CSV
}

RSpec.describe ImportProvincePlans do
  subject { ImportProvincePlans.new.call }

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

  it 'Creates new province climate plans' do
    expect { subject }.to change { Province::ClimatePlan.count }.by(2)
  end

  it 'Creates new province development plans' do
    expect { subject }.to change { Province::DevPlan.count }.by(2)
  end

  describe 'Imported dev plan record' do
    before { subject }

    let(:imported_record) { Province::DevPlan.first }

    it 'has all attributes populated' do
      imported_record.attributes.each do |attr, value|
        expect(value).not_to be_nil, "attribute #{attr} expected to not be nil"
      end
    end

    describe 'supportive policy directions' do
      let(:policy_directions) { imported_record[:supportive_policy_directions] }

      it 'has 3 entries' do
        expect(policy_directions.length).to be(3)
      end

      it 'has valid values for entry' do
        policy_direction = policy_directions.find { |p| p['sector'] == 'Waste' }
        expect(policy_direction).to eq(
          'sector' => 'Waste',
          'value' => 'policy direction waste'
        )
      end
    end
  end
end
