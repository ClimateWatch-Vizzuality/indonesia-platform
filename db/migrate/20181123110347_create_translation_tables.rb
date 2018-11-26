class CreateTranslationTables < ActiveRecord::Migration[5.2]
  def change
    add_column :commitment_timeline_entries, :locale, :string, null: false, default: :en
    add_column :funding_opportunities, :locale, :string, null: false, default: :en
    add_column :province_climate_plans, :locale, :string, null: false, default: :en
    add_column :province_development_plans, :locale, :string, null: false, default: :en

    reversible do |dir|
      dir.up do
        remove_column :indicators, :name
        remove_column :indicators, :unit
        add_column :indicators, :name, :jsonb, default: {}
        add_column :indicators, :unit, :jsonb, default: {}

        remove_column :data_sources, :description
        remove_column :data_sources, :citation
        remove_column :data_sources, :summary
        remove_column :data_sources, :source_organization
        add_column :data_sources, :description, :jsonb, default: {}
        add_column :data_sources, :citation, :jsonb, default: {}
        add_column :data_sources, :summary, :jsonb, default: {}
        add_column :data_sources, :source_organization, :jsonb, default: {}

        remove_column :locations, :wri_standard_name
        add_column :locations, :wri_standard_name, :jsonb, default: {}
      end

      dir.down do
        remove_column :indicators, :name
        remove_column :indicators, :unit
        add_column :indicators, :name, :string
        add_column :indicators, :unit, :string

        remove_column :data_sources, :description
        remove_column :data_sources, :citation
        remove_column :data_sources, :summary
        remove_column :data_sources, :source_organization
        add_column :data_sources, :description, :text
        add_column :data_sources, :citation, :text
        add_column :data_sources, :summary, :text
        add_column :data_sources, :source_organization, :string

        remove_column :locations, :wri_standard_name
        add_column :locations, :wri_standard_name, :text, null: false
      end
    end
  end
end
