# task :get_silicon_data => :environment do

#   require 'open-uri'
#   require 'json'
#   require 'dotenv'

#   # text file
#   crunchbase_file = File.new('SiliconCompanies.txt', 'r')
#   my_key = ENV['api_key']

#   # splits each line into an array of elements and assigns elements as values of keys in Silicon object
#   i = 0
#   crunchbase_file.each do |line|
#     file = open("http://api.crunchbase.com/v/1/company/#{line.chomp}.js?api_key=#{my_key}")
#     contents = file.read
#     # puts contents
#     hash = JSON.parse contents

#     i += 1
#     puts "-------Count: " + i.to_s + "---------"
#     puts "Company: " + hash["name"]

#     Silicon.create(name: hash["name"], category_code: hash["category_code"])
#   end
#   crunchbase_file.close

# end