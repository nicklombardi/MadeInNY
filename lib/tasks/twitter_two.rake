task twitter_two: :environment do

require 'twitter'

Twitter.configure do |config|
  config.consumer_key = ENV['TWITTER_CONSUMER_KEY2']
  config.consumer_secret = ENV['TWITTER_CONSUMER_SECRET2']
  config.oauth_token = ENV['TWITTER_OAUTH_TOKEN2']
  config.oauth_token_secret = ENV['TWITTER_OAUTH_TOKEN_SECRET2']
end

companies = Company.all

companies[101..200].each do |company|
  unless company.twitter_username.nil? || company.latitude.nil?
    begin
      current_followers = Twitter.user(company.twitter_username)[:followers_count]
    rescue Twitter::Error::NotFound
      puts "That user doesn't exist"
    end
    puts "--------------------------------------------------------------------------"
    puts "looping through db - #{company.id}: #{company.twitter_username} / previous followers: #{company.followers} / previous change #{company.total_amount}"

    found_company = Company.find(company.id)
    puts "found company - #{found_company.id}: #{found_company.twitter_username} current followers: #{found_company.followers} / current change: #{found_company.total_amount}"
    unless current_followers == found_company.followers
      found_company.total_amount = current_followers - found_company.followers
      found_company.followers = current_followers
      if found_company.total_amount <= 0
        found_company.total_amount = 0
      end
      puts "info to save - #{found_company.id}: #{found_company.twitter_username} updated followers: #{found_company.followers} / updated change: #{found_company.total_amount}"
    end
    found_company.save
  end
end


end