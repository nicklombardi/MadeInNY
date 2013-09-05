require 'spec_helper'

describe Silicon do
  it "has a valid factory" do
    FactoryGirl.create(:silicon).should be_valid
  end

  it "is invalid without a name" do
    FactoryGirl.build(:silicon, name: nil).should_not be_valid
  end

  it "is invalid when the name is less than 2 characters long" do
    FactoryGirl.build(:silicon, name: "a").should_not be_valid
  end
end