class CreateFundingOpportunities < ActiveRecord::Migration[5.2]
  def change
    create_table :funding_opportunities do |t|
      t.string :source
      t.text :project_name
      t.text :mode_of_support
      t.text :sectors_and_topics
      t.text :description
      t.text :application_procedure
      t.text :website_link
      t.integer :last_update_year

      t.timestamps
    end
  end
end
