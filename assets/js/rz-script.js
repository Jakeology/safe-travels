var bodyContainer = document.body;
var cityNameInput = document.getElementById("city-input");

var cityData = {};
var covidData = {};

const options = {
  fields: ["address_components", "formatted_address", "geometry"],
  strictBounds: false,
  types: ["(cities)"],
};

const autocomplete = new google.maps.places.Autocomplete(cityNameInput, options);

autocomplete.addListener("place_changed", () => {
  const place = autocomplete.getPlace();

  if (!place.geometry || !place.geometry.location) {
    return;
  }

  storeCityData(place);
});

function storeCityData(place) {
  var lat = place.geometry.location.lat();
  var lon = place.geometry.location.lng();

  cityData["lat"] = lat;
  cityData["lon"] = lon;

  for (var i = 0; i < place.address_components.length; i++) {
    const type = place.address_components[i].types[0];
    console.log(type);

    switch (type) {
      case "locality":
        cityData["city"] = place.address_components[i].long_name;
        break;
      case "administrative_area_level_1":
        cityData["state"] = place.address_components[i].short_name;
        break;
      case "administrative_area_level_2":
        cityData["county_name"] = place.address_components[i].long_name;
        break;
    }

    if (place.address_components[i].types[0] === "country") {
      if (place.address_components[i].short_name === "US") {
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
  var apiUrl = "https://api.covidactnow.org/v2/county/" + cityData.county_id +".json?apiKey=a76656a67c614ecf8405967df3fded3f";

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

// function buttonClick(event) {
//   var target = event.target;

//   if (target.matches("#city-search")) {

//   }
// }

// bodyContainer.addEventListener("click", buttonClick);
