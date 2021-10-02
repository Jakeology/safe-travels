var bodyContainer = document.body;
var cityNameInput = document.getElementById("city-input");

var countyData = {};

const options = {
  fields: ["address_components", "geometry"],
  strictBounds: false,
  types: ["(cities)"],
};

const autocomplete = new google.maps.places.Autocomplete(cityNameInput, options);

autocomplete.addListener("place_changed", () => {
  const place = autocomplete.getPlace();

  if (!place.geometry || !place.geometry.location) {
    return;
  }

  var lat = place.geometry.location.lat();
  var lon = place.geometry.location.lng();

  console.log(place);

  for(var i = 0; i < place.address_components.length; i++) {
    if (place.address_components[i].types[0] === "country") {
      if (place.address_components[i].short_name === "US") {
        getCountyData(lat, lon, getCovidData);
      } else {
        console.log("This is NOT in the US");
      }
    }
  }
});

function getCountyData(lat, lon, callback) {
  var apiUrl = "https://geo.fcc.gov/api/census/area?lat=" + lat + "&lon=" + lon + "&format=json";

  fetch(apiUrl)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          countyData = data;
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

  var apiUrl = "https://api.covidactnow.org/v2/county/" + countyData.results[0].county_fips + ".json?apiKey=a76656a67c614ecf8405967df3fded3f";

  fetch(apiUrl)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          console.log(data);
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
  var covidContainer = document.getElementById("covid-container");
  
}

// function buttonClick(event) {
//   var target = event.target;

//   if (target.matches("#city-search")) {

//   }
// }

// bodyContainer.addEventListener("click", buttonClick);
