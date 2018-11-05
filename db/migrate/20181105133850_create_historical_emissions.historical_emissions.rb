# This migration comes from historical_emissions (originally 20180814095305)
class CreateHistoricalEmissions < ActiveRecord::Migration[5.1]
  def change
    unless table_exists?(:historical_emissions_data_sources)
      create_table :historical_emissions_data_sources do |t|
        t.text :name
        t.text :display_name
        t.timestamps
      end
    end

    unless table_exists?(:historical_emissions_sectors)
      create_table :historical_emissions_sectors do |t|
        t.references :parent,
          foreign_key: {to_table: :historical_emissions_sectors, on_delete: :cascade}, index: true
        t.references :data_source,
          foreign_key: {to_table: :historical_emissions_data_sources, on_delete: :cascade}, index: true
        t.text :name
        t.text :annex_type
        t.timestamps
      end
    end

    unless table_exists?(:historical_emissions_gases)
      create_table :historical_emissions_gases do |t|
        t.text :name
        t.timestamps
      end
    end

    unless table_exists?(:historical_emissions_gwps)
      create_table :historical_emissions_gwps do |t|
        t.text :name
        t.timestamps
      end
    end

    unless table_exists?(:historical_emissions_records)
      create_table :historical_emissions_records do |t|
        t.references :location, foreign_key: {on_delete: :cascade}, index: true
        t.references :data_source, foreign_key: {to_table: :historical_emissions_data_sources, on_delete: :cascade}, index: true
        t.references :sector, foreign_key: {to_table: :historical_emissions_sectors, on_delete: :cascade}, index: true
        t.references :gas, foreign_key: {to_table: :historical_emissions_gases, on_delete: :cascade}, index: true
        t.references :gwp, foreign_key: {to_table: :historical_emissions_gwps, on_delete: :cascade}, index: true
        t.jsonb :emissions
        t.timestamps
      end
    end
  end
end
