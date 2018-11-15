class CreateSectionContent < ActiveRecord::Migration[5.2]
  def change
    create_table :section_contents do |t|
      t.string :title
      t.text :description
      t.string :locale
      t.string :slug
      t.string :name
      t.integer :order
      t.datetime :updated_at
      t.datetime :created_at
    end
  end
end
