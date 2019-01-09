class DropSectionContents < ActiveRecord::Migration[5.2]
  def change
    drop_table :section_contents
  end
end
