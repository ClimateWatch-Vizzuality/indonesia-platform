require 'rails_helper'

correct_files = {
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
missing_headers_files = correct_files.merge(
  ImportProvincePlans::CLIMATE_PLANS_FILEPATH => <<~END_OF_CSV,
    Source,Sector,Subsector,Mitigation Activities
    RADGRKb,ID.AC,Agriculture,subsector,mitigation activities for id.ac
    RADGRKb,ID.BA,Forest,subsector,mitigation activities for id.ba
  END_OF_CSV
)
missing_locations_files = correct_files.merge(
  ImportProvincePlans::CLIMATE_PLANS_FILEPATH => <<~END_OF_CSV,
    Source,geoid,Sector,Subsector,Mitigation Activities
    RADGRKb,ID.CC,Agriculture,subsector,mitigation activities for id.ac
    RADGRKb,ID.BA,Forest,subsector,mitigation activities for id.ba
  END_OF_CSV
)

RSpec.describe ImportProvincePlans do
  let(:importer) { ImportProvincePlans.new }

  before :each do
    FactoryBot.create(:location, iso_code3: 'ID.AC')
    FactoryBot.create(:location, iso_code3: 'ID.BA')
  end

  after :all do
    Aws.config[:s3] = {
      stub_responses: nil
    }
  end

  context 'with correct files' do
    subject { importer.call }

    before :all do
      stub_with_files(correct_files)
    end

    it 'Creates new province climate plans' do
      expect { subject }.to change { Province::ClimatePlan.count }.by(2)
    end

    it 'Creates new province development plans' do
      expect { subject }.to change { Province::DevelopmentPlan.count }.by(2)
    end

    describe 'Imported dev plan record' do
      before { subject }

      let(:imported_record) { Province::DevelopmentPlan.first }

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

  context 'when headers are missing' do
    before :all do
      stub_with_files(missing_headers_files)
    end

    it 'does not create any development plan' do
      expect { importer.call }.to change { Province::DevelopmentPlan.count }.by(0)
    end

    it 'does not create any climate plan' do
      expect { importer.call }.to change { Province::ClimatePlan.count }.by(0)
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

    it 'does not create any plan with missing location' do
      expect { importer.call }.to change { Province::ClimatePlan.count }.by(1)
    end

    it 'has errors on row' do
      importer.call
      expect(importer.errors.length).to eq(1)
      expect(importer.errors.first).to include(type: :invalid_row)
    end
  end
end
