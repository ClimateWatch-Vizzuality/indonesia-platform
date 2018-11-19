require 'rails_helper'

RSpec.describe Funding::Opportunity, type: :model do
  it 'should be valid' do
    expect(FactoryBot.build(:funding_opportunity)).to be_valid
  end
end
