require 'rails_helper'

RSpec.describe DataSource, type: :model do
  it 'should be invalid when short title not present' do
    expect(
      FactoryBot.build(:data_source, short_title: nil)
    ).to have(1).errors_on(:short_title)
  end

  it 'should be invalid when short title is taken' do
    FactoryBot.create(:data_source, short_title: 'NDC')
    expect(
      FactoryBot.build(:data_source, short_title: 'NDC')
    ).to have(1).errors_on(:short_title)
  end

  it 'should be valid' do
    expect(FactoryBot.build(:data_source)).to be_valid
  end
end
