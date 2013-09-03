// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.

var getCompanyData = function() {
  console.log("welcome to the uss homestar.com");

  // retrieves data from home controller index action
  $.ajax({
    url: '/home.json',
    dataType: 'json',
    data: 'GET'
  }).done(function (data) {
    console.log(data);
  });

};

$(document).ready(function() {
  console.log("your mom");
  getCompanyData();
});