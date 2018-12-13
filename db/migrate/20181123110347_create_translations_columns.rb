class CreateTranslationsColumns < ActiveRecord::Migration[5.2]
  def change
    add_column :commitment_timeline_entries, :locale, :string, null: false, default: :en
    add_column :funding_opportunities, :locale, :string, null: false, default: :en
    add_column :province_climate_plans, :locale, :string, null: false, default: :en
    add_column :province_development_plans, :locale, :string, null: false, default: :en

    add_column :indicators, :translations, :jsonb, default: {}
    add_column :data_sources, :translations, :jsonb, default: {}
    add_column :locations, :translations, :jsonb, default: {}
    add_column :historical_emissions_sectors, :translations, :jsonb, default: {}
    add_column :historical_emissions_metrics, :translations, :jsonb, default: {}
    add_column :emission_activity_sectors, :translations, :jsonb, default: {}
  end
end
