require 'spec_helper'

describe HomeController do
  describe "GET #index" do
    let(:companies) {Company.all}
    it "populates an array of companies" do
      get :index
      assigns(:companies).should eq(companies)
    end
  end

  describe "GET #silicon" do
    let(:silicons) {Silicon.all}
    it "populates an array of silicons" do
      get :silicon
      assigns(:silicons).should eq(silicons)
    end
  end

  permitted_company_attr = [:name, :homepage_url, :category_code, :crunchbase_url, :twitter_username, :description, :founded_year, :total_money_raised, :address1, :address2, :city, :state_code, :zip_code, :latitude, :longitude, :number_of_employees]
  permitted_for_company = permitted_company_attr.join(', ')

  it "should permit: #{permitted_for_company}" do
    controller.params = { company: permitted_company_attr }
    controller.params.require(:company).should_receive(:permit).with(*permitted_company_attr)
    controller.send :company_params
  end

  permitted_silicon_attr = [:name, :category_code]
  permitted_for_silicon = permitted_silicon_attr.join(', ')

  it "should permit: #{permitted_for_silicon}" do
    controller.params = { silicon: permitted_silicon_attr }
    controller.params.require(:silicon).should_receive(:permit).with(*permitted_silicon_attr)
    controller.send :silicon_params
  end

end