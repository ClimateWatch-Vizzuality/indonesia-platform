class CreateEmissionActivityValues < ActiveRecord::Migration[5.2]
  def change
    create_table :emission_activity_values do |t|
      t.references :location,
                   foreign_key: {
                     on_delete: :cascade
                   }
      t.references :sector,
                   foreign_key: {
                     to_table: :emission_activity_sectors,
                     on_delete: :cascade
                   }
      t.jsonb :emissions
    end
  end
end
