class CreateIndicatorCategories < ActiveRecord::Migration[5.2]
  # have to re-import the data, no production site yet so it should be all good
  def up
    create_table :indicator_categories do |t|
      t.text :name, null: false
      t.jsonb :translations, default: {}
      t.timestamps
    end
    add_index :indicator_categories, :name, unique: true

    remove_column :indicator_values, :category
    add_reference :indicator_values,
                  :category,
                  foreign_key: { to_table: :indicator_categories, on_delete: :cascade }
  end

  def down
    remove_reference :indicator_values, :category
    add_column :indicator_values, :category, :string
    drop_table :indicator_categories
  end
end
