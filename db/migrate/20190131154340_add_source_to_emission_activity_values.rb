class AddSourceToEmissionActivityValues < ActiveRecord::Migration[5.2]
  def change
    add_column :emission_activity_values, :source, :string
  end
end
