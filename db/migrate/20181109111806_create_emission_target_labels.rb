class CreateEmissionTargetLabels < ActiveRecord::Migration[5.2]
  def change
    create_table :emission_target_labels do |t|
      t.text :name, null: false
      t.timestamps
    end
    add_index :emission_target_labels, :name, unique: true
  end
end
