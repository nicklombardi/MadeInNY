class CreateFollowers < ActiveRecord::Migration
  def change
    create_table :followers do |t|
      t.string :name
      t.string :twitter_username
      t.integer :total_amount
      t.string :category

      t.timestamps
    end
  end
end
