require 'rails_helper'

correct_files = {
  ImportDataSources::DATA_FILEPATH => <<~END_OF_CSV,
    short title,title,Source Organization,learn_more_link,summary,description,caution,citation
    STATIDNa,Population,Central Bureau of Statistics,http://link.me,summary,population data 2010-2016,description,caution,citation
    STATIDNb,Population,Central Bureau of Statistics,http://link.me,summary,population data 2010-2016,description,caution,citation
  END_OF_CSV
  ImportDataSources::DATA_ID_FILEPATH => <<~END_OF_CSV,
    short title,title,Source Organization,learn_more_link,summary,description,caution,citation
    STATIDNa,Population ID,Central Bureau of Statistics,http://link.me,summary,population data 2010-2016,description,caution,citation
    STATIDNb,Population ID,Central Bureau of Statistics,http://link.me,summary,population data 2010-2016,description,caution,citation
  END_OF_CSV
}
missing_headers = correct_files.merge(
  ImportDataSources::DATA_FILEPATH => <<~END_OF_CSV,
    Source Organization,learn_more_link,summary,description,caution,citation
    STATIDNa,Population,Central Bureau of Statistics,http://link.me,summary,population data 2010-2016,description,caution,citation
    STATIDNb,Population,Central Bureau of Statistics,http://link.me,summary,population data 2010-2016,description,caution,citation
  END_OF_CSV
)

RSpec.describe ImportDataSources do
  subject { ImportDataSources.new.call }

  after :all do
    Aws.config[:s3] = {
      stub_responses: nil
    }
  end

  context 'when file is correct' do
    before :all do
      stub_with_files(correct_files)
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

      it 'has english translation' do
        I18n.with_locale(:en) do
          expect(imported_record.title).to eq('Population')
        end
      end

      it 'has indonesian translation' do
        I18n.with_locale(:id) do
          expect(imported_record.title).to eq('Population ID')
        end
      end
    end
  end

  context 'when headers are missing' do
    before :all do
      stub_with_files(missing_headers)
    end

    subject { ImportDataSources.new }

    it 'does not create any record' do
      expect { subject.call }.to change { DataSource.count }.by(0)
    end

    it 'has missing headers errors' do
      subject.call
      expect(subject.errors.length).to eq(2)
      expect(subject.errors.first).to include(type: :missing_header)
    end
  end
end
