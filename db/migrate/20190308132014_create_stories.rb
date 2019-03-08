class CreateStories < ActiveRecord::Migration[5.2]
  def change
    create_table :stories do |t|
      t.string :title
      t.text :description
      t.datetime :published_at
      t.string :background_image_url
      t.string :link
      t.string :tags, array: true, default: []

      t.timestamps
    end
  end
end
