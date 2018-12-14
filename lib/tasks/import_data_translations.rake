namespace :data_translations do
  desc 'Imports data translations'
  task import: :environment do
    TimedLogger.log('import data translations') do
      ImportDataTranslations.new.call
    end
  end
end
