var bodyContainer = document.body;
var cityNameInput = document.getElementById("city-input");

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

  console.log(place);
});

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
