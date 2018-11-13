class CreateEmissionActivitySectors < ActiveRecord::Migration[5.2]
  def change
    create_table :emission_activity_sectors do |t|
      t.text :name
      t.references :parent,
                   foreign_key: {
                     to_table: :emission_activity_sectors,
                     on_delete: :cascade
                   }
      t.timestamps
    end
    add_index :emission_activity_sectors, [:name, :parent_id], unique: true
  end
end
