source 'https://rubygems.org'

gem 'rails', '4.0.0'
gem 'sass-rails', '~> 4.0.0'
gem 'uglifier', '>= 1.3.0'
gem 'turbolinks'
gem 'jquery-rails'
gem 'jbuilder', '~> 1.2'
gem 'coffee-rails', '~> 4.0.0'

gem 'pg'

group :production do
  gem 'unicorn'
  gem 'dalli'
  gem 'memcachier'
  gem 'rack-cache'
  gem 'newrelic_rpm'
  # gem 'rack-google-analytics'
  gem "rack-timeout"
end

group :doc do
  gem 'sdoc', require: false
end

gem 'dotenv-rails'
gem 'twitter'
gem "thin"

group :development, :test do
  gem 'rspec'
  gem 'rspec-rails'
  gem 'factory_girl_rails'

  gem 'jasmine'
end
