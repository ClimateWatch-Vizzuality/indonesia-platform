require 'rails_helper'

RSpec.describe CommitmentTimeline::Entry, type: :model do
  it 'should be invalid when year not present' do
    expect(
      FactoryBot.build(:commitment_timeline_entry, year: nil)
    ).to have(1).errors_on(:year)
  end

  it 'should be valid' do
    expect(FactoryBot.build(:commitment_timeline_entry)).to be_valid
  end
end
