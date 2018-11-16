namespace :db do
  desc 'Imports everything'
  task import: :environment do
    Rake::Task['locations:import'].invoke
    Rake::Task['location_members:import'].invoke
    Rake::Task['historical_emissions:import'].invoke
    Rake::Task['emission_targets:import'].invoke
    Rake::Task['emission_activities:import'].invoke
    Rake::Task['commitment_timeline_entries:import'].invoke
    Rake::Task['indicators:import'].invoke
    puts 'All done!'
  end
end
