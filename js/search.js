"use strict";

//Executes a search query based on the user's input.
async function searchQuery(data) {
  try {
    let responseObject = await fetch("/search", {
      method: 'POST',
      headers: {
        "Accept": 'application/json',
        "Content-Type": 'application/json'
      },
      body: JSON.stringify(data)
    });
    let parsedJSON = await responseObject.json();

    if (parsedJSON.status === "success") {
      window.location.href = "/results";
    }

  } catch (error) {}
}

//Updates an existing search query and performs it.
async function searchUpdate(data) {
  try {
    let responseObject = await fetch("/searchUpdate", {
      method: 'POST',
      headers: {
        "Accept": 'application/json',
        "Content-Type": 'application/json'
      },
      body: JSON.stringify(data)
    });
    let parsedJSON = await responseObject.json();

    if (parsedJSON.status === "success") {
      window.location.href = "/results";
    }

  } catch (error) {
  }
}

//Adds a click event to perform a search when the search button is pressed.
ready(document.getElementById("btn").addEventListener("click", function(e) {
  e.preventDefault();
  let unit = document.getElementById("unitVal").value;
  let streetNum = document.getElementById("streetNumVal").value;
  let streetName = document.getElementById("streetNameVal").value;
  let city = document.getElementById("cityVal").value;
  let province = document.getElementById("provinceVal").value;
  
  if (city && province) {
    if (unit === "") {
      unit = "%";
    }
    if (streetNum === "") {
      streetNum = "%";
    }
    if (streetName === "") {
      streetName = "%";
    }
    if (city === "") {
      city = "%";
    }
    searchQuery({
      "unit": unit,
      "streetNum": streetNum,
      "prefix": document.getElementById("prefixInput").value,
      "streetName": streetName,
      "streetType": document.getElementById("streetTypeInput").value,
      "city": city,
      "province": province
    });
  } else {
    e.preventDefault();
    //Save user inputs and input box ids into two arrays
    let formData = [city, province];
    let inputBoxId = ["cityVal", "provinceVal"];
    //use a for loop to mark all mandatory fields that have no data with red border
    for (let i = 0; i < 2; i++) {
      if (formData[i] === null || formData[i].trim() === "") {
        document.getElementById(inputBoxId[i]).setAttribute("style", "border: 3px solid #DB3A34");
        //remove red border for fields that have data
      } else {
        document.getElementById(inputBoxId[i]).removeAttribute("style", "border: 3px solid #DB3A34");
      }
    };
    document.getElementById("msg").innerText = "Please fill in all required fields."
  }

}))

//Executes callback when the document is loaded.
function ready(callback) {
  if (document.readyState != "loading") {
    callback();
  } else {
    document.addEventListener("DOMContentLoaded", callback);
  }
}