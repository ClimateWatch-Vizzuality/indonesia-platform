class CreateIndicatorValues < ActiveRecord::Migration[5.2]
  def change
    create_table :indicator_values do |t|
      t.references :location, foreign_key: {on_delete: :cascade}, index: true
      t.references :indicator, foreign_key: {on_delete: :cascade}, index: true
      t.string :category
      t.jsonb :values
    end
  end
end
