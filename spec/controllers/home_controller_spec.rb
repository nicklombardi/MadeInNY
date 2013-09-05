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
end