var bodyContainer = document.body;
var cityNameInput = document.getElementById("city-input");

var lat = 0;
var lon = 0;

var fips = 0;

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

  lat = place.geometry.location.lat();
  lon = place.geometry.location.lng();

  //TODO Remove console logs
  console.log(lat);
  console.log(lon);

  if (place.address_components[3].short_name === "US") {
    getCountyCovidData(lat, lon, displayCovidData);
  } else {
    console.log("This is NOT in the US");
  }
});

function getCountyCovidData(lat, lon, callback) {
  var apiUrl = "https://geo.fcc.gov/api/census/area?lat=" + lat + "&lon=" + lon +"&format=json";

  fetch(apiUrl)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          fips = data.results[0].county_fips;
          return callback(fips);
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
  console.log(fips);
}

function buttonClick(event) {
  var target = event.target;

  if (target.matches("#city-search")) {
    // if(place) {
    //   return console.log("Invalid");
    // }
    // let lat = place.geometry.location.lat();
    // let long = place.geometry.location.lng();
    // console.log(lat);
    // console.log(long);
  }
}

bodyContainer.addEventListener("click", buttonClick);
