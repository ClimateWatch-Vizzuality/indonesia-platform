namespace :province_plans do
  desc 'Imports province climate and development plans'
  task import: :environment do
    TimedLogger.log('import province climate and development plans') do
      ImportProvincePlans.new.call
    end
  end
end
