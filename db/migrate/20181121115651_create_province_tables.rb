class CreateProvinceTables < ActiveRecord::Migration[5.2]
  def change
    create_table :province_climate_plans do |t|
      t.references :location, foreign_key: { on_delete: :cascade }
      t.text :mitigation_activities
      t.string :source
      t.string :sector
      t.string :sub_sector

      t.timestamps
    end

    create_table :province_dev_plans do |t|
      t.references :location, foreign_key: { on_delete: :cascade }
      t.string :source
      t.string :rpjmd_period
      t.text :supportive_mission_statement
      t.jsonb :supportive_policy_directions

      t.timestamps
    end
  end
end
