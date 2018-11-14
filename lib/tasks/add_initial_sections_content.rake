namespace :db do
  desc 'Add initial sections content'
  task add_initial_sections_content: :environment do
    file = File.join(Rails.root, 'config/initial_sections_content.yml')
    config = YAML.load_file(file)

    config['sections'].each do |section|
      s = SectionContent.find_by(slug: section['slug'], locale: section['locale'])
      s.update(title: section['title'])
      s.update(description: section['description'])
    end

    puts 'Sections seeded!'
  end
end
