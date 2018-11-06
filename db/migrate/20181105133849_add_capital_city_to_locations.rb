class AddCapitalCityToLocations < ActiveRecord::Migration[5.2]
  def change
    add_column :locations, :capital_city, :text
  end
end
