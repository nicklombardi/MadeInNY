class Silicon < ActiveRecord::Base
  validates :name, presence: true
  validates :name, length: { minimum: 2 }
end