namespace :funding_opportunities do
  desc 'Imports funding opportunities'
  task import: :environment do
    TimedLogger.log('import funding opportunities') do
      ImportFundingOpportunities.new.call
    end
  end
end
