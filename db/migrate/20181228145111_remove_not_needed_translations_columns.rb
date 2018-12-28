class RemoveNotNeededTranslationsColumns < ActiveRecord::Migration[5.2]
  def change
    remove_column :historical_emissions_sectors, :translations, :jsonb, default: {}
    remove_column :historical_emissions_metrics, :translations, :jsonb, default: {}
    remove_column :historical_emissions_gases, :translations, :jsonb, default: {}
    remove_column :emission_activity_sectors, :translations, :jsonb, default: {}
    remove_column :emission_target_sectors, :translations, :jsonb, default: {}
  end
end
