// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.
var companiesObject,
    dataset = [];

var getCompanyData = {
    dataFromDatabase: function() {
        var that = this;
        console.log("welcome to the uss homestar.com");

        // retrieves data from home controller index action
        $.ajax({
            url: '/home.json',
            dataType: 'json',
            data: 'GET'
        }).done(function (data) {
            console.log(data);
            companiesObject = data;
            that.prepDataForD3(data);
        });
    },
    prepDataForD3: function(data) {
        console.log("prepping data");
        var i,
            length = data.length;
        for(i = 0; i < length; i++) {
            dataset.push([data[i].longitude, data[i].latitude, data[i].total_money_raised, data[i].name, data[i].description]);
        }
    }
};

$(document).ready(function() {
  console.log("your mom");
  getCompanyData.dataFromDatabase();
});

// var dataset = [
//               [-73.989418, 40.739300, 14.3, "General Assembly", "info"], [-74.008068, 40.739395, 46, "Warby Parker", "info"]
//               ];