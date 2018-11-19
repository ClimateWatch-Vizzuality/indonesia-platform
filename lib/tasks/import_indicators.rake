namespace :indicators do
  desc 'Imports indicators with values'
  task import: :environment do
    TimedLogger.log('import indicators with values') do
      ImportIndicators.new.call
    end
  end
end
