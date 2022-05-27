"use strict";

//Requests the server to log the user in using the credentials in the document.
async function submitCredentials(data) {
  try {
    let responseObject = await fetch("/login", {
      method: 'POST',
      headers: {
        "Accept": 'application/json',
        "Content-Type": 'application/json'
      },
      body: JSON.stringify(data)
    });
    let parsedJSON = await responseObject.json();

    if (parsedJSON.status === "fail") {
      document.getElementById("errorMsg").innerHTML = parsedJSON.msg;
    } else {
      window.location.replace("/home");
    }

  } catch (error){}
}

//Adds a click event to the submit button, to execute the submitCredentials function.
ready(document.getElementById("btn").addEventListener("click", function (e) {
  submitCredentials({
    "username": document.getElementById("usernameBox").value,
    "password": document.getElementById("passwordBox").value
  });
}))

//Executes callback when the document is loaded.
function ready(callback) {
  if (document.readyState != "loading") {
    callback();
  } else {
    document.addEventListener("DOMContentLoaded", callback);
  }
}