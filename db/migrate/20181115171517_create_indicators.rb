class CreateIndicators < ActiveRecord::Migration[5.2]
  def change
    create_table :indicators do |t|
      t.string :section, null: false
      t.string :code, null: false
      t.string :name, null: false
      t.string :unit, null: false
      t.timestamps
    end

    add_index :indicators, :code, unique: true
    add_index :indicators, :section
  end
end
