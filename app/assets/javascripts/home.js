// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.
var companiesObject,
    // for making dots
    dataset = [],
    // for making new york part of donut
    categories = {
        fashion: 0,
        tech: 0,
        advertising: 0,
        other: 0,
        ecommerce: 0,
        finance: 0,
        education: 0,
        enterprise: 0
    },
    siliconCategories = {
        fashion: 0,
        tech: 0,
        advertising: 0,
        other: 0,
        ecommerce: 0,
        finance: 0,
        education: 0,
        enterprise: 0
    };

// this is just for our knowledge (seeing what the categories are) and how many companies we don't have funding info for
var allCategoriesArray = [],
    numberOfCompaniesWithoutFunding = 0;

var getCompanyData = {
    dataFromDatabase: function() {
        var that = this;
        console.log("going to make ajax request for companies");

        // retrieves data from home controller index action
        // data for dots on map
        $.ajax({
            url: '/home.json',
            dataType: 'json',
            data: 'GET'
        }).done(function (data) {
            console.log("got data from companies database");
            console.log(data);
            companiesObject = data;

            // sorts database descendingly by twitter users
            // correlates well enough to funding to have smaller circles on top
            function compare(a,b) {
              if (a.followers > b.followers)
                 return -1;
              if (a.followers < b.followers)
                return 1;
              return 0;
            }

            data.sort(compare);

            // calls prepDataForD3 function
            that.prepDataForD3(data);
            donutChart.getSiliconData();
        });
    },
    prepDataForD3: function(data) {
        console.log("prepping companies data");
        var i,
            length = data.length,
            fundingString,
            fundingArray,
            thousandOrMillion,
            totalFunding,
            category;

        for(i = 0; i < length; i++) {
            // total_money_raised attribute is currently in format of $6M or $316k
            fundingString = data[i].total_money_raised;
            fundingArray = fundingString.split("$");
            thousandOrMillion = fundingArray[1][fundingArray[1].length - 1];

            // formats funding number based on whether it's in millions or thousands
            if (thousandOrMillion === "k") {
                totalFunding = parseFloat(fundingArray[1]) / 1000;
            } else if (thousandOrMillion === "M") {
                totalFunding = parseFloat(fundingArray[1]);
            } else if (fundingArray[1] === "0") {
                totalFunding = 1;
                numberOfCompaniesWithoutFunding += 1;
            }

            //put stuff in bubble
            // bubbleInBubbleChart.push(data[i].name, data[i].id, data[i].twitter_username, data[i].total_amount);

            // populates global variable dataset array
            // for dots
            dataset.push([data[i].longitude, data[i].latitude, totalFunding, data[i].name, data[i].description, data[i].followers, data[i].homepage_url, data[i].address1, data[i].address2, data[i].city, data[i].state_code, data[i].zip_code]);

            // this keeps track of how many companies belong to a category
            category = data[i].category_code;
            allCategoriesArray.push(category);

            if (category === "fashion") {
                categories.fashion += 1;
            } else if ((category === "web") || (category === "search") || (category === "mobile") || (category === "software") || (category === "hardware") || (category === "games_video") || (category === "cleantech") || (category === "social") || (category === "messaging") || (category === "photo_video")) {
                categories.tech += 1;
            } else if ((category === "advertising") || (category === "public_relations")) {
                categories.advertising += 1;
            } else if (category === "ecommerce") {
                categories.ecommerce += 1;
            } else if (category === "finance") {
                categories.finance += 1;
            } else if (category === "education") {
                categories.education += 1;
            } else if (category === "enterprise") {
                categories.enterprise += 1;
            } else {
                categories.other += 1;
            }

        }

        // calls d3PlotPoints function to create points and description divs using global variable dataset
        console.log("creating dots all over the place");
        makeMap.d3PlotPoints(dataset);
    }
};

$(document).ready(function() {
    console.log("window loaded");
    getCompanyData.dataFromDatabase();
});