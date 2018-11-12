class RemoveUsersFromMainDb < ActiveRecord::Migration[5.2]
  def change
    return if !table_exists? :admin_users
    drop_table :admin_users
  end
end
