namespace :emission_targets do
  desc 'Imports emission targets'
  task import: :environment do
    TimedLogger.log('import emission targets') do
      ImportEmissionTargets.new.call
    end
  end
end
