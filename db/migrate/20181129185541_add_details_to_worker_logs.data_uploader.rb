# This migration comes from data_uploader (originally 20181129153835)
class AddDetailsToWorkerLogs < ActiveRecord::Migration[5.2]
  def change
    add_column :worker_logs, :details, :jsonb, default: {}
  end
end
