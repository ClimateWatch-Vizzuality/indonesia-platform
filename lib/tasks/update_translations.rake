namespace :db do
  desc 'Update translations'
  task update_translations: :environment do
    Rake::Task['db:add_content_management_records'].invoke
    Rake::Task['db:add_initial_sections_content'].invoke
    puts 'Translations updated!'
  end
end
