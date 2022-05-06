"use strict";
async function createAccount(data) {
  
  try {
    console.log("hi");
    let responseObject = await fetch("/signup", {
      method: 'POST',
      headers: {
        "Accept": 'application/json',
        "Content-Type": 'application/json'
      },
      body: JSON.stringify(data)
    });
    
    let parsedJSON = await responseObject.json();
    console.log(parsedJSON);
    if (parsedJSON.status === "fail") {
      document.getElementById("createErrorMsg").innerHTML = parsedJSON.msg;
    } else {
      window.location.replace("/login");
    }

  } catch (error) {
    console.log(error);
  }
}

ready(document.getElementById("createBtn").addEventListener("click", function(e) {
  createAccount({
    "username": document.getElementById("usernameBox").value,
    "password": document.getElementById("passwordBox").value,
    "firstName": document.getElementById("firstNameBox").value,
    "lastName":document.getElementById("lastNameBox").value,
    "email":document.getElementById("email").value,
    "role_id":0
  });
}))

function ready(callback) {
  if (document.readyState != "loading") {
    callback();
    console.log("ready state is 'complete'");
  } else {
    document.addEventListener("DOMContentLoaded", callback);
    console.log("Listener was invoked");
  }
}