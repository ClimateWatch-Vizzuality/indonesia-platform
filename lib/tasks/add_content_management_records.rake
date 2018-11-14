namespace :db do
  desc 'Add content management records'
  task add_content_management_records: :environment do
    file = File.join(Rails.root, 'config/content_management_sections.yml')
    config = YAML.load_file(file)

    config['locales'].each do |locale|
      config['sections'].each do |section|
        SectionContent.find_or_create_by(slug: section['slug'], locale: locale) do |s|
          s.name = section['name']
          s.order = section['order']
          s.locale = locale
        end
      end
    end

    puts 'All sections for content management created!'
  end
end
