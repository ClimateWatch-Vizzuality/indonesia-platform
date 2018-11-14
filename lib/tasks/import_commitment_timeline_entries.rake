namespace :commitment_timeline_entries do
  desc 'Imports commitment timeline entries'
  task import: :environment do
    TimedLogger.log('import commitment timeline entries') do
      ImportCommitmentTimelineEntries.new.call
    end
  end
end
