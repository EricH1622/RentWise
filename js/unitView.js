"use strict";

// define variables
let editing = false;
let editBox;
let data;
let options;

// function for editing a review item
function edit_init() {
  if (!editing) {
    editing = true;

    // stores the parent div of the review item
    var editingReview = (document.getElementById("editBtn").parentNode.id);

    // create edit box
    editBox = document.createElement("div");
    editBox.className = "editBox";
    // richtext editor
    editBox.innerHTML += '<div id="richText"><form method="post"><textarea id="mytextarea">' + document.getElementById(editingReview).querySelector(".rev").innerHTML + ' </textarea></form></div>';
    // image collection
    editBox.innerHTML += '<div id="photoCollection">' +  document.getElementById(editingReview).querySelector(".images").innerHTML + '</div>';
    // Add image button
    editBox.innerHTML += '<div id="imgUpload">Upload image: <button type="button" id="uploadBtn">Upload</button></div>';
    // Cancel button
    editBox.innerHTML += "<div class='' id='cancelBtn' onclick='cancel()'>Cancel</div>";
    // Submit button
    editBox.innerHTML += "<div class='' id='submitBtn' onclick='submit_data()'>Submit</div>";
    // System error div
    editBox.innerHTML += "<div id='errMsg'></div>";
    // Position insertion
    document.querySelector("#reviews").insertAdjacentElement("afterbegin", editBox);
    
    // set review item to hidden
    document.getElementById(editingReview).classList.add('hidden');
    
  } 
}

// function to submit an edited review
async function submit_data() {
  // stores the parent div of the review item
  var editingReview = (document.getElementById("editBtn").parentNode.id);

  // data to be sent as request to server
  data = {"content" : document.getElementById('mytextarea').value,
                "post_id": editingReview
          }; 

  // options for the serverside function
  options = {
    method: 'POST',
    headers: {
      "Accept": 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  }

  // server response handling
  const response = await fetch('/submitEdit', options);
  const status = await response.json();

  // successful update
  if (status.status == "success") {
    // hide edit box
    editBox.style.display = "none";
    // update review item
    document.getElementById(editingReview).querySelector(".rev").innerHTML = data.content;
    // make review item visible
    document.getElementById(editingReview).classList.remove('hidden');
    // set editing to false
    editing = false;
  } 
  // failed update
  if (status.status == "fail") {
    // did not update (review is empty or only invalid characters)
    document.getElementById('errMsg').innerHTML="*Error, review content invalid";
  }
}

// function to cancel an edit state
async function cancel() {
  // hide edit box
  editBox.style.display = "none";
  // stores the parent div of review item
  var editingReview = (document.getElementById("editBtn").parentNode.id);
  // make review item visible
  document.getElementById(editingReview).classList.remove('hidden');
  // set editing to false
  editing = false;
}
