var bodyContainer = document.body;
var cityNameInput = document.getElementById("city-input");

var cityData = {};
var covidData = {};

function getCityData(lat, lon) {
  var apiUrl =
    "https://maps.googleapis.com/maps/api/geocode/json?latlng=" +
    lat +
    "," +
    lon +
    "&sensor=true&key=AIzaSyB1I-mViDpNAowaTQE5sr3IrZeILM5esfw";

  fetch(apiUrl)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          storeCityData(lat, lon, data);
        });
      } else {
        alert("Error");
      }
    })
    .catch(function (error) {
      alert("Unable to connect to API");
    });
}

function storeCityData(lat, lon, data) {
  var components = data.results[0].address_components;

  cityData["lat"] = lat;
  cityData["lon"] = lon;

  for (var i = 0; i < components.length; i++) {
    const type = components[i].types[0];

    switch (type) {
      case "locality":
        cityData["city"] = components[i].long_name;
        break;
      case "administrative_area_level_1":
        cityData["state"] = components[i].short_name;
        break;
      case "administrative_area_level_2":
        cityData["county_name"] = components[i].long_name;
        break;
      case "country":
        cityData["country"] = components[i].short_name;
        break;
    }

    if (components[i].types[0] === "country") {
      if (components[i].short_name === "US") {
        getCountyData(lat, lon, getCovidData);
      } else {
        console.log("This is NOT in the US");
      }
    }
  }
}

function getCountyData(lat, lon, callback) {
  var apiUrl = "https://geo.fcc.gov/api/census/area?lat=" + lat + "&lon=" + lon + "&format=json";

  fetch(apiUrl)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          cityData["county_id"] = data.results[0].county_fips;
          console.log(cityData);
          return callback(data.results[0].county_fips);
        });
      } else {
        alert("Error");
      }
    })
    .catch(function (error) {
      alert("Unable to connect to API");
    });
}

function getCovidData() {
  var apiUrl =
    "https://api.covidactnow.org/v2/county/" + cityData.county_id + ".json?apiKey=a76656a67c614ecf8405967df3fded3f";

  fetch(apiUrl)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          covidData = data;
          //console.log(data);
          displayCovidData();
        });
      } else {
        alert("Error");
      }
    })
    .catch(function (error) {
      alert("Unable to connect to API");
    });
}

function displayCovidData() {
  var c19Title = document.getElementById("c19-city-title");

  c19Title.textContent = cityData.city + ", " + cityData.state;
}

function getLatLon() {
  var queryString = document.location.search;

  var params = new URLSearchParams(queryString);
  var lat = params.get("lat");
  var lon = params.get("lon");

  getCityData(lat, lon);
}

getLatLon();
