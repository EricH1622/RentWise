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

//Easter egg code :)
let eggActive = false;
let timesClicked = 0;
ready(document.getElementById("copyright").addEventListener("click", function(e) {
  let timer;
  if(eggActive == false){
    eggActive = true;
    timer = setTimeout(function(){
      eggActive = false;
      if (timesClicked < 7) {
        for (let i = 1; i <= 7; i++) {
          document.getElementById("c" + i).style.color = "white";
        }
      }
      timesClicked = 0;
    }, 1500)
  }
  timesClicked++;
  if(timesClicked >= 7){
    document.getElementById("c7").style.color = "rgb(255, 157, 0)";
    document.getElementById("easterEgg").style.display = "grid";
    //Don't want to display the easter egg stuff in the div before the user triggers it, but if a savvy user sees the div with nothing in it they might be incentivized to try to search for the trigger
    document.getElementById("easterEgg").innerHTML = `<img src="/assets/images/closeButton.png" id="closeEgg"/>
    <iframe id="easterEggVideo" src="https://www.youtube-nocookie.com/embed/9ti1k2tnDTM" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
    <h1>...It looks like you've found something!</h1>`;

    document.getElementById("closeEgg").addEventListener("click", function(e) {
      document.getElementById("easterEgg").style.display = "none";
      document.getElementById("easterEgg").innerHTML = "";
      eggActive = false;
      for (let i = 1; i <= 7; i++) {
        document.getElementById("c" + i).style.color = "white";
      }
    });

  } else{
    document.getElementById("c" + timesClicked).style.color = "rgb(255, 157, 0)";
  }
}))

//Easter egg code is over now



function ready(callback) {
  if (document.readyState != "loading") {
    callback();
  } else {
    document.addEventListener("DOMContentLoaded", callback);
  }
}


// *****Upload Profile Picture *****

const upLoadForm = document.getElementById("pictureForm");
upLoadForm.addEventListener("submit", uploadImages);

function uploadImages(e) {
    e.preventDefault();

    const imageUpload = document.querySelector('#imageUpload');
    const formData = new FormData();

    for(let i =0; i < imageUpload.files.length; i++) {
        // put the images from the input into the form data
        formData.append("files", imageUpload.files[i]);
    }

    const options = {
        method: 'POST',
        body: formData,
    };

    fetch("/upload-images", options
    ).then(function(res) {
        console.log(res);
    }).catch(function(err) {("Error:", err)}
    );

    document.getElementById("pictureMsg").innerHTML = "Profile Picture Uploaded";

}