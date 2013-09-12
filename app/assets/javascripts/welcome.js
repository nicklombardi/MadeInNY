// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.

$(document).ready(function() {


  $(".welcome").mouseenter(function(){
    $(".welcome").fadeTo("fast",1);
  });

  $(".welcome").mouseleave(function(){
    $(".welcome").fadeTo("fast",.8);
  });

});
