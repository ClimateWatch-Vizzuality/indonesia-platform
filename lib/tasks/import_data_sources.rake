namespace :data_sources do
  desc 'Imports data sources for metadata endpoint'
  task import: :environment do
    TimedLogger.log('import data sources for metadata') do
      ImportDataSources.new.call
    end
  end
end
