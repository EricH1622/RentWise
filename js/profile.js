"use strict";
async function updateProfile(data) {
  
  try {
    let responseObject = await fetch("/update-profile", {
      method: 'POST',
      headers: {
        "Accept": 'application/json',
        "Content-Type": 'application/json'
      },
      body: JSON.stringify(data)
    });
    let parsedJSON = await responseObject.json();
    document.getElementById("msg").innerHTML = parsedJSON.msg;
  } catch (error) {
  }
}

ready(document.getElementById("editButton").addEventListener("click", function(e) {
  if((document.getElementById("username").value) && (document.getElementById("password").value) && (document.getElementById("firstName").value) && (document.getElementById("lastName").value) && (document.getElementById("email").value)){
    e.preventDefault();
    updateProfile({
      "username": document.getElementById("username").value,
      "password": document.getElementById("password").value,
      "firstName": document.getElementById("firstName").value,
      "lastName":document.getElementById("lastName").value,
      "email":document.getElementById("email").value,
    });
  } else {
    document.getElementById("msg").innerText = "Please fill out all fields.";
  }
}))

function ready(callback) {
  if (document.readyState != "loading") {
    callback();
  } else {
    document.addEventListener("DOMContentLoaded", callback);
  }
}