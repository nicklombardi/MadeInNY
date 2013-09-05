class AddFollowersToCompanies < ActiveRecord::Migration
  def change
    add_column :companies, :followers, :integer
    add_column :companies, :total_amount, :integer
  end
end
