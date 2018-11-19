require 'rails_helper'

object_contents = {
  ImportFundingOpportunities::DATA_FILEPATH => <<~END_OF_CSV,
    source,project_name,mode_of_support,sectors_and_topics,Description,application_procedure,website_link,last_update_web
    NDCP, project, Technical Assistance, sectors, description, procedure, https://google.com, 2018
  END_OF_CSV
}

RSpec.describe ImportFundingOpportunities do
  subject { ImportFundingOpportunities.new.call }

  before :all do
    Aws.config[:s3] = {
      stub_responses: {
        get_object: lambda do |context|
          {body: object_contents[context.params[:key]]}
        end
      }
    }
  end

  after :all do
    Aws.config[:s3] = {
      stub_responses: nil
    }
  end

  it 'Creates new funding opportunities records' do
    expect { subject }.to change { Funding::Opportunity.count }.by(1)
  end
end
