class AddSourceAndUnitToEmissionTargetValues < ActiveRecord::Migration[5.2]
  def change
    change_table :emission_target_values do |t|
      t.string :source
      t.string :unit
    end
  end
end
