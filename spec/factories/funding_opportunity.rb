FactoryBot.define do
  factory :funding_opportunity, class: 'Funding::Opportunity' do
    source { 'NDCP' }
    project_name { 'BioCarbon Fund' }
    mode_of_support { 'Financial' }
    sectors_and_topics { 'Forestry' }
    description { 'Description' }
    application_procedure { 'Procedure' }
    website_link { 'http://www.biocarbonfund-isfl.org/' }
    last_update_year { 2017 }
  end
end
