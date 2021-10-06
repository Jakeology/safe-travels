var bodyContainer = document.body;
var cityNameInput = document.getElementById("city-input");
var cityResultsContainer = document.getElementById("c19-CR");

var cityData = {};
var covidData = {};

function getCityData(lat, lon) {
  const apiUrl =
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
  const apiUrl = "https://geo.fcc.gov/api/census/area?lat=" + lat + "&lon=" + lon + "&format=json";

  fetch(apiUrl)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          cityData["county_id"] = data.results[0].county_fips;
          // console.log(cityData);
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
  const apiUrl =
    "https://api.covidactnow.org/v2/county/" + cityData.county_id + ".json?apiKey=a76656a67c614ecf8405967df3fded3f";

  fetch(apiUrl)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          covidData = data;
          console.log(data);
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
  var cityTitle = document.getElementById("c19-CT");

  cityTitle.textContent = cityData.city + ", " + cityData.state + " (" + cityData.county_name + ")";

  var riskLevel = document.getElementById("c19-RL");

  var riskResultDivEl = document.createElement("div");
  var riskResultSpanEl = document.createElement("span");

  var getRiskLevel = getRiskResult("RL", covidData.riskLevels.overall);

  riskResultDivEl.className = "risk-result " + getRiskLevel;
  riskResultSpanEl.textContent = getRiskLevel.toUpperCase();

  riskLevel.appendChild(riskResultDivEl);
  riskLevel.appendChild(riskResultSpanEl);

  var vaccineProgress1D = covidData.metrics.vaccinationsInitiatedRatio * 100;
  var vaccineProgress2D = covidData.metrics.vaccinationsCompletedRatio * 100;

  var VR1D = new ldBar("#PB-VR-1D");
  VR1D.set(Math.round(vaccineProgress1D * 10) / 10, false);

  var VR2D = new ldBar("#PB-VR-2D");
  VR2D.set(Math.round(vaccineProgress2D * 10) / 10, false);

  var dailyCasesCont = document.getElementById("DC");

  var dcDiv = document.createElement("div");
  var dcSpan = document.createElement("span");
  var dcSpan2 = document.createElement("span");

  var getDailyCaseLevel = getRiskResult("DC", covidData.metrics.caseDensity);

  dcDiv.className = "risk-result " + getDailyCaseLevel;
  dcSpan.className = "bold";
  dcSpan.textContent = covidData.metrics.caseDensity;
  dcSpan2.className = "small";
  dcSpan2.textContent = " per 100K";

  dailyCasesCont.appendChild(dcDiv);
  dailyCasesCont.appendChild(dcSpan);
  dailyCasesCont.appendChild(dcSpan2);

  var infectionRateEl = document.getElementById("IR");

  var irDiv = document.createElement("div");
  var irSpan = document.createElement("span");

  var getInfectinRateLevel = getRiskResult("IR", covidData.metrics.infectionRate);

  irDiv.className = "risk-result " + getInfectinRateLevel;
  irSpan.className = "bold";
  irSpan.textContent = covidData.metrics.infectionRate + "%";

  infectionRateEl.appendChild(irDiv);
  infectionRateEl.appendChild(irSpan);

  var positiveRateEl = document.getElementById("PT");

  var ptDiv = document.createElement("div");
  var ptSpan = document.createElement("span");

  var getPositiveTestNum = covidData.metrics.testPositivityRatio * 100;

  var getPositiveTestLevel = getRiskResult("PT", getPositiveTestNum);

  ptDiv.className = "risk-result " + getPositiveTestLevel;
  ptSpan.className = "bold";
  ptSpan.textContent = getPositiveTestNum + "%";

  positiveRateEl.appendChild(ptDiv);
  positiveRateEl.appendChild(ptSpan);

  $("#preloader").fadeOut("slow");
}

function getRiskResult(type, num) {
  if (type === "RL") {
    if (num < 1) {
      return "low";
    } else if (num >= 1 && num < 2) {
      return "medium";
    } else if (num >= 2 && num < 3) {
      return "high";
    } else if (num >= 3 && num < 4) {
      return "critical";
    } else {
      return "severe";
    }
  }

  if (type === "DC") {
    if (num < 1) {
      return "low";
    } else if (num >= 1 && num < 10) {
      return "medium";
    } else if (num >= 10 && num < 25) {
      return "high";
    } else if (num >= 25 && num < 75) {
      return "critical";
    } else {
      return "severe";
    }
  }

  if (type === "IR") {
    if (num < 0.9) {
      return "low";
    } else if (num >= 0.9 && num < 1.1) {
      return "medium";
    } else if (num >= 1.1 && num < 1.4) {
      return "high";
    } else if (num >= 1.4 && num < 1.7) {
      return "critical";
    } else {
      return "severe";
    }
  }

  if (type === "PT") {
    if (num < 3) {
      return "low";
    } else if (num >= 3 && num < 10) {
      return "medium";
    } else if (num >= 10 && num < 20) {
      return "high";
    } else if (num >= 20 && num < 25) {
      return "critical";
    } else {
      return "severe";
    }
  }
}

function getLatLon() {
  var queryString = document.location.search;

  var params = new URLSearchParams(queryString);
  var lat = params.get("lat");
  var lon = params.get("lon");

  getCityData(lat, lon);
}

$(window).on('resize', function() {
  if($(window).width() > 400) {
      $('#t1').addClass('d-none');
      $('#t2').removeClass('d-none');
  } else {
      $('#t2').addClass('d-none');
      $('#t1').removeClass('d-none');
  }
})

getLatLon();
