FactoryBot.define do
  factory :commitment_timeline_entry, class: 'CommitmentTimeline::Entry' do
    text { 'UNFCCC' }
    note { 'UNFCCC entry into force with 194 signatories' }
    year { '2020' }
  end
end
