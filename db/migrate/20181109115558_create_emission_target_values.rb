class CreateEmissionTargetValues < ActiveRecord::Migration[5.2]
  def change
    create_table :emission_target_values do |t|
      t.references :location,
                   foreign_key: {
                     on_delete: :cascade
                   }
      t.references :label,
                   foreign_key: {
                     to_table: :emission_target_labels,
                     on_delete: :cascade
                   }
      t.references :sector,
                   foreign_key: {
                     to_table: :emission_target_sectors,
                     on_delete: :cascade
                   }
      t.integer :year
      t.float :first_value
      t.float :second_value
      t.timestamps
    end
  end
end
