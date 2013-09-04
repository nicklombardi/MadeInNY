class CreateSilicons < ActiveRecord::Migration
  def change
    create_table :silicons do |t|
      t.string :name
      t.text :category_code

      t.timestamps
    end
  end
end
