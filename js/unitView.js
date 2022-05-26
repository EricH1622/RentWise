"use strict";

// define variables
let editing = false;
let editBox;
let data;
let options;

function edit_init() {
  if (!editing) {
    editing = true;
    // CREATE EDIT DIV
    // initial set up
    editBox = document.createElement("div");
    editBox.className = "editBox";
    // editBox.style.backgroundColor = "blue";
    // get content for the review
    // editBox.innerHTML += document.getElementById("1").querySelector(".rev").innerHTML;
    // make the review item invisible
    // set review item to hidden
    document.getElementById("1").classList.add('hidden');
    // editRow.classList.add("hidden");
    // richtext editor
    editBox.innerHTML += '<div id="richText"><form method="post"><textarea id="mytextarea">' + document.getElementById("1").querySelector(".rev").innerHTML + ' </textarea></form></div>';
    // image collection
    editBox.innerHTML += '<div id="photoCollection">' +  document.getElementById("1").querySelector(".images").innerHTML + '</div>';
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
  } 
}

async function submit_data() {
  data = {"content" : document.getElementById('mytextarea').value,
                "post_id": 1}; //1 = div id
  console.log("submit");
  options = {
    method: 'POST',
    headers: {
      "Accept": 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  }
  const response = await fetch('/submitEdit', options);
  const status = await response.json();
  console.log(status.status);
  if (status.status == "success") {
    // successful update
    editBox.style.display = "none";
    document.getElementById("1").classList.remove('hidden');
    editing = false;
  } 
  if (status.status == "fail") {
    // did not update (review is empty)
    document.getElementById('errMsg').innerHTML="Error, review content invalid";
  }
}

async function cancel() {
  editBox.style.display = "none";
  document.getElementById("1").classList.remove('hidden');
  editing = false;
}
