class RemoveUnitNotNullContraintFromIndicators < ActiveRecord::Migration[5.2]
  def change
    change_column_null :indicators, :unit, true, ''
  end
end
