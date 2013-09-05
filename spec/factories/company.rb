FactoryGirl.define do

  factory :company do |f|
    f.name "Taboola"
    f.homepage_url "http://www.taboola.com"
    f.category_code nil
    f.crunchbase_url nil
    f.twitter_username "taboola"
    f.description "Content you may like"
    f.founded_year nil
    f.total_money_raised "$40M"
    f.address1 nil
    f.address2 nil
    f.city nil
    f.state_code nil
    f.zip_code nil
    f.latitude 40.740998
    f.longitude -73.991718
    f.number_of_employees nil
  end

end