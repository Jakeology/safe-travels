var cityNameInput = document.getElementById("city-input");

const options = {
  fields: ["geometry"],
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

  location.href = "./results.html?lat=" + lat.toFixed(8) + "&lon=" + lon.toFixed(8);

});