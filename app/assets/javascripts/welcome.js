// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.

$(document).ready(function() {

  $(".glyphicon-cog").mouseenter(function(){
    console.log('mouseenter');
    $(".map-info").removeClass('hidden');
  });

  $(".glyphicon-cog").mouseleave(function(){
    console.log('mouseout');
  $(".map-info").addClass('hidden');
  });

  $('.data').find(".glyphicon-cog").mouseenter(function(){
    console.log('mouseenter');
    $(".map-info").removeClass('hidden');
  });

  $('.data').find(".glyphicon-cog").mouseleave(function(){
    console.log('mouseout');
  $(".map-info").addClass('hidden');
  });

  $("#key").find(".glyphicon").mouseenter(function(){
    console.log('mouseenter');
    $(".map-info").removeClass('hidden');
  });

  $("#key").find(".glyphicon").mouseleave(function(){
    console.log('mouseout');
  $(".map-info").addClass('hidden');
  });

});
