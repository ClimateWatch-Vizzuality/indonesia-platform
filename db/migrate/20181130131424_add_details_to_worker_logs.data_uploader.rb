# This migration comes from data_uploader (originally 20181129153835)
class AddDetailsToWorkerLogs < ActiveRecord::Migration[5.2]
  def up
    add_column :worker_logs, :details, :jsonb, default: {}
    DataUploader::WorkerLog.find_each do |log|
      if log.error.present?
        log.update!(details: { errors: [{ type: :error, msg: log.error }] })
      end
    end
    remove_column :worker_logs, :error
  end

  def down
    add_column :worker_logs, :error, :text
    DataUploader::WorkerLog.find_each do |log|
      log.update!(error: log.details&.dig('errors')&.first&.dig('msg'))
    end
    remove_column :worker_logs, :details
  end
end
