require 'rails_helper'

object_contents = {
  ImportDataSources::DATA_FILEPATH => <<~END_OF_CSV,
    short title,title,Source Organization,learn_more_link,summary,description,caution,citation
    STATIDNa,Population,Central Bureau of Statistics,http://link.me,summary,population data 2010-2016,description,caution,citation
    STATIDNb,Population,Central Bureau of Statistics,http://link.me,summary,population data 2010-2016,description,caution,citation
  END_OF_CSV
}

RSpec.describe ImportDataSources do
  subject { ImportDataSources.new.call }

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

  it 'Creates new data source records' do
    expect { subject }.to change { DataSource.count }.by(2)
  end

  describe 'Imported record' do
    before { subject }

    let(:imported_record) { DataSource.find_by(short_title: 'STATIDNa') }

    it 'has all attributes populated' do
      expect(imported_record.attributes.values).to all(be_truthy)
    end
  end
end
