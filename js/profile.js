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

ready(function(e) {

  document.getElementById("editButton").addEventListener("click", function(e) {
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
  });

  document.getElementById("pictureForm").addEventListener("submit", uploadImages);

})


// *****Upload Profile Picture *****

async function uploadImages(e) {
  e.preventDefault();

  const imageUpload = document.querySelector('#imageUpload');
  const formData = new FormData();

  formData.append("submitType", "profile");

  if (imageUpload.files.length > 0) {
      formData.append("images", imageUpload.files[0]);
  }

  const options = {
      method: 'POST',
      body: formData,
  };

  fetch("/upload-images", options
  ).then(function(resp) {
      resp.json().then(function(parsedObj) {
        if (parsedObj.status == "success") {
          document.getElementById("pictureMsg").innerHTML = "Profile Picture Uploaded";
          document.getElementById("profilePhoto").src = parsedObj.imagepath;
        }          
      });
  }).catch(function(err) {
    console.log("problem connecting to server with Error: ", err);
  });
}


function ready(callback) {
  if (document.readyState != "loading") {
    callback();
  } else {
    document.addEventListener("DOMContentLoaded", callback);
  }
}

