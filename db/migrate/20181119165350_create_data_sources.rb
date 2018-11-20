class CreateDataSources < ActiveRecord::Migration[5.2]
  def change
    create_table :data_sources do |t|
      t.string :short_title
      t.string :title
      t.string :source_organization
      t.string :learn_more_link
      t.text :summary
      t.text :description
      t.text :caution
      t.text :citation

      t.timestamps
    end
    add_index :data_sources, :short_title, unique: true
  end
end
