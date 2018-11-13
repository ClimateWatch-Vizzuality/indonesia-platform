namespace :emission_activities do
  desc 'Imports emission activities'
  task import: :environment do
    TimedLogger.log('import emission activities') do
      ImportEmissionActivities.new.call
    end
  end
end
