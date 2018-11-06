# This migration comes from locations (originally 20180814135810)
class CreateLocations < ActiveRecord::Migration[5.1]
  def change
    # rubocop:disable Style/GuardClause
    unless table_exists?(:locations)
      create_table :locations do |t|
        t.text :iso_code3, null: false
        t.text :iso_code2, null: false
        t.text :location_type, null: false
        t.text :wri_standard_name, null: false
        t.boolean :show_in_cw, null: false, default: true
        t.text :pik_name
        t.text :cait_name
        t.text :ndcp_navigators_name
        t.text :unfccc_group
        t.json :topojson
        t.jsonb :centroid
        t.timestamp
      end
    end

    unless table_exists?(:location_members)
      create_table :location_members do |t|
        t.references :location, index: true, foreign_key: {on_delete: :cascade}
        t.references :member, index: true, foreign_key: {to_table: :locations, on_delete: :cascade}
      end
    end
    # rubocop:enable Style/GuardClause
  end
end
