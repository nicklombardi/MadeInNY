require 'spec_helper'

describe HomeController do
  describe "routing" do

    it "routes to #index" do
      get("/").should route_to("home#index")
    end

    it "routes to #silicon" do
      get("/silicon").should route_to("home#silicon")
    end

  end
end