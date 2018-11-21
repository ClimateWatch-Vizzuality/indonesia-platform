namespace :db do
  desc 'Add initial sections content'
  task add_initial_sections_content: :environment do
    en_file = File.join(Rails.root, 'config/translations/en.yml')
    id_file = File.join(Rails.root, 'config/translations/id.yml')

    config_en = YAML.load_file(en_file)
    config_id = YAML.load_file(id_file)

    configs = [config_en, config_id]

    configs.each do |config|
      config.each do |locale, slugs|
        next unless slugs&.each do |slug, content|
          s = SectionContent.find_by(slug: slug, locale: locale)
          s.update(title: content['title'])
          s.update(description: content['description'])
        end
      end
    end

    puts 'Sections seeded!'
  end
end
