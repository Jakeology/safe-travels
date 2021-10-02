var bodyContainer = document.body;

function buttonClick(event) {
    var target = event.target;
  
    if (target.matches("#city-search")) {
      console.log("Works");
    }
  }

bodyContainer.addEventListener("click", buttonClick);