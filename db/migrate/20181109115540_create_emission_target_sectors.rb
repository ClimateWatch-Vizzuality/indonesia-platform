class CreateEmissionTargetSectors < ActiveRecord::Migration[5.2]
  def change
    create_table :emission_target_sectors do |t|
      t.text :name, null: false
      t.timestamps
    end
    add_index :emission_target_sectors, :name, unique: true
  end
end
