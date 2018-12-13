require 'rails_helper'

correct_files = {
  ImportCommitmentTimelineEntries::DATA_FILEPATH => <<~END_OF_CSV,
    Text,Note,Year,Link
    UNFCCC,UNFCCC entry into force with 194 signatories,1994,
    Kyoto Protocol Agreement,Under Kyoto Protocol 37 countries listed on Annex I commit greenhouse gas reduction by 5.2% from 1990 level,1997,https://europa.eu/capacity4dev/file/25349/download?token=CrIxEFUW
    Kyoto Protocol First Commitment Period,,2008-2012,
  END_OF_CSV
  ImportCommitmentTimelineEntries::DATA_ID_FILEPATH => <<~END_OF_CSV,
    Text,Note,Year,Link
    UNFCCC,UNFCCC entry into force with 194 signatories - indonesia,1994,
  END_OF_CSV
}
missing_headers_files = correct_files.merge(
  ImportCommitmentTimelineEntries::DATA_FILEPATH => <<~END_OF_CSV,
    Text,Note,Year
    UNFCCC,UNFCCC entry into force with 194 signatories,1994,
  END_OF_CSV
)

RSpec.describe ImportCommitmentTimelineEntries do
  let(:importer) { ImportCommitmentTimelineEntries.new }

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

  context 'when file is correct' do
    subject { importer.call }

    before :all do
      stub_with_files(correct_files)
    end

    context 'english' do
      it 'Creates new entries' do
        expect { subject }.to change { CommitmentTimeline::Entry.where(locale: :en).count }.by(3)
      end
    end

    context 'indonesian' do
      it 'Creates new entries' do
        expect { subject }.to change { CommitmentTimeline::Entry.where(locale: :id).count }.by(1)
      end
    end
  end

  context 'when headers are missing' do
    before :all do
      stub_with_files(missing_headers_files)
    end

    it 'does not create any entry' do
      expect { importer.call }.to change { CommitmentTimeline::Entry.count }.by(0)
    end

    it 'has missing headers errors' do
      importer.call
      expect(importer.errors.length).to eq(1)
      expect(importer.errors.first).to include(type: :missing_header)
    end
  end
end
