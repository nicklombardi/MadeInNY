class CreateCompanies < ActiveRecord::Migration
  def change
    create_table :companies do |t|
      t.string :name
      t.text :homepage_url
      t.text :category_code
      t.text :crunchbase_url
      t.string :twitter_username
      t.text :description
      t.integer :founded_year
      t.string :total_money_raised
      t.string :address1
      t.string :address2
      t.string :city
      t.string :state_code
      t.string :zip_code
      t.float :latitude
      t.float :longitude
      t.integer :number_of_employees

      t.timestamps
    end
  end
end
