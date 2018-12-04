require 'rails_helper'

correct_files = {
  ImportFundingOpportunities::DATA_FILEPATH => <<~END_OF_CSV,
    source,project_name,mode_of_support,sectors_and_topics,Description,application_procedure,website_link,last_update_web
    NDCP, project, Technical Assistance, sectors, description, procedure, https://google.com, 2018
  END_OF_CSV
}
missing_headers_files = {
  ImportFundingOpportunities::DATA_FILEPATH => <<~END_OF_CSV,
    mode_of_support,sectors_and_topics,Description,application_procedure,website_link,last_update_web
    NDCP, project, Technical Assistance, sectors, description, procedure, https://google.com, 2018
  END_OF_CSV
}

RSpec.describe ImportFundingOpportunities do
  let(:importer) { ImportFundingOpportunities.new }

  after :all do
    Aws.config[:s3] = {
      stub_responses: nil
    }
  end

  context 'when file is correct' do
    subject { ImportFundingOpportunities.new.call }

    before :all do
      stub_with_files(correct_files)
    end

    it 'Creates new funding opportunities records' do
      expect { subject }.to change { Funding::Opportunity.count }.by(1)
    end
  end

  context 'when headers are missing' do
    before :all do
      stub_with_files(missing_headers_files)
    end

    it 'does not create any entry' do
      expect { importer.call }.to change { Funding::Opportunity.count }.by(0)
    end

    it 'has missing headers errors' do
      importer.call
      expect(importer.errors.length).to eq(2)
      expect(importer.errors.first).to include(type: :missing_header)
    end
  end
end
