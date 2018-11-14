class CreateCommitmentTimelineEntries < ActiveRecord::Migration[5.2]
  def change
    create_table :commitment_timeline_entries do |t|
      t.text :text
      t.text :note
      t.text :link
      t.string :year
    end
  end
end
