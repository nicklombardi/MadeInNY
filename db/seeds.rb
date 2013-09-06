# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

buzzfeed = Company.find(23)
buzzfeed.longitude = -73.993234
buzzfeed.latitude = 40.741158
buzzfeed.save

knewton = Company.find(90)
knewton.longitude = -73.993103
knewton.latitude = 40.736925
knewton.save

etsy = Company.find(51)
etsy.longitude = -73.989477
etsy.latitude = 40.702923
etsy.save

foursquare = Company.find(59)
foursquare.longitude = -73.997476
foursquare.latitude = 40.724402
foursquare.save

ga = Company.find(63)
ga.longitude = -73.989418
ga.latitude = 40.739300
ga.save

how_about_we = Company.find(75)
how_about_we.longitude = -73.986759
how_about_we.latitude = 40.704007
how_about_we.save

lot18 = Company.find(97)
lot18.longitude = -73.984800
lot18.latitude = 40.746696
lot18.save

skillshare = Company.find(150)
skillshare.longitude = -73.998005
skillshare.latitude = 40.720884
skillshare.save

squarespace = Company.find(159)
squarespace.longitude = -74.001037
squarespace.latitude = 40.720896
squarespace.save

warby_parker = Company.find(187)
warby_parker.longitude = -74.004142
warby_parker.latitude = 40.725933
warby_parker.save

stamped = Company.find(160)
stamped.twitter_username = "stampedapp"
stamped.save

appaddictive = Company.find(7)
appaddictive.twitter_username = "appaddictive"
appaddictive.save

dotbox = Company.find(47)
dotbox.twitter_username = "dotboxNYC"
dotbox.save

jetsetter = Company.find(83)
jetsetter.twitter_username = "Jetsetterdotcom"
jetsetter.save

kaptur = Company.find(87)
kaptur.twitter_username = "KapturIt"
kaptur.save

panelfly = Company.find(119)
panelfly.twitter_username = "Panelfly"
panelfly.save

liquid = Company.find(158)
liquid.twitter_username = "spinlister"
liquid.save

Company.create([
  {name: "Taboola", homepage_url: "http://www.taboola.com", twitter_username: "taboola", description: "Content you may like", total_money_raised: "$40M", latitude: 40.740998, longitude: -73.991718},
  {name: "Spotify", homepage_url: "http://www.spotify.com", twitter_username: "spotify", description: "Music for every moment", total_money_raised: "$288M", latitude: 40.741781, longitude: -74.004501},
  {name: "Bonobos", homepage_url: "http://www.bonobos.com", twitter_username: "bonobos", description: "Well-crafted, great-fitting clothing", total_money_raised: "$72.7M", latitude: 40.744066, longitude: -73.991013}])