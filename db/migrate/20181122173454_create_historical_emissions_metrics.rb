class CreateHistoricalEmissionsMetrics < ActiveRecord::Migration[5.2]
  def change
    create_table :historical_emissions_metrics do |t|
      t.string :name, null: false
      t.string :unit, null: false
    end

    add_index :historical_emissions_metrics, [:name, :unit], unique: true

    remove_column :historical_emissions_records, :metric, :text

    add_reference :historical_emissions_records,
                  :metric,
                  foreign_key: {
                    to_table: :historical_emissions_metrics,
                    on_delete: :cascade
                  }
  end
end
