task :get_extra_company_data => :environment do

 require 'open-uri'
 require 'json'
 require 'dotenv'

 # text file
 crunchbase_file = File.new('companyNames.txt', 'r')
 my_key = ENV['api_key']

 # splits each line into an array of elements and assigns elements as values of keys in Company object
 i = 0
 crunchbase_file.each do |line|
   file = open("http://api.crunchbase.com/v/1/company/#{line.chomp}.js?api_key=#{my_key}")
   contents = file.read
   # puts contents
   hash = JSON.parse contents

   i += 1
   puts "-------Count: " + i.to_s + "---------"
   puts "Company: " + hash["name"]

   Company.create(name: hash["name"],
     homepage_url: hash["homepage_url"],
     category_code: hash["category_code"],
     crunchbase_url: hash["crunchbase_url"],
     twitter_username: hash["twitter_username"],
     description: hash["description"],
     founded_year: hash["founded_year"],
     total_money_raised: hash["total_money_raised"],
     address1: hash["offices"][0]["address1"],
     address2: hash["offices"][0]["address2"],
     state_code: hash["offices"][0]["state_code"],
     zip_code: hash["offices"][0]["zip_code"],
     latitude: hash["offices"][0]["latitude"],
     longitude: hash["offices"][0]["longitude"],
     number_of_employees: hash["number_of_employees"])
 end
 crunchbase_file.close

end