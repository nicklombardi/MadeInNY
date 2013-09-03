class HomeController < ApplicationController
  def index
    @companies = Company.all
  end

  private
  # This is all of my private methods
  def company_params
    params.require(:company).permit(:name, :homepage_url, :category_code, :crunchbase_url, :twitter_username, :description, :founded_year, :total_money_raised, :address1, :address2, :city, :state_code, :zip_code, :latitude, :longitude, :number_of_employees)
  end
end
