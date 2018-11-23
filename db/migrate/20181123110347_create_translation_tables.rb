class CreateTranslationTables < ActiveRecord::Migration[5.2]
  def change
    add_column :commitment_timeline_entries, :locale, :string, null: false, default: :en
    add_column :funding_opportunities, :locale, :string, null: false, default: :en
    add_column :province_climate_plans, :locale, :string, null: false, default: :en
    add_column :province_development_plans, :locale, :string, null: false, default: :en

    reversible do |dir|
      dir.up do
        DataSource.create_translation_table!(
          {
            title: :string,
            source_organization: :string,
            caution: :text,
            description: :text,
            citation: :text,
            summary: :text
          }, {
            migrate_data: true,
            remove_source_columns: true
          }
        )

        Indicator.create_translation_table!(
          {
            name: :string,
            unit: :string,
          }, {
            migrate_data: true,
            remove_source_columns: true
          }
        )
      end

      dir.down do
        DataSource.drop_translation_table! migrate_data: true
        Indicator.drop_translation_table! migrate_data: true
      end
    end
  end
end
