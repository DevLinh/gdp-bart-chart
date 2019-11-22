var urlSource =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";

// Get Dataset from source
var request = new XMLHttpRequest();
request.open("GET", urlSource, true);
request.send();
var json = {};
request.onload = function() {
  json = JSON.parse(request.responseText);
  console.log(json);
};
