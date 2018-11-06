class AddMetricToHistoricalEmissionsRecords < ActiveRecord::Migration[5.2]
  def change
    add_column :historical_emissions_records, :metric, :text
  end
end
