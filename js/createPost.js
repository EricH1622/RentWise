"use strict";
console.log(new Date().toLocaleString());
tinymce.init({
  selector: '#mytextarea',
  plugins: [
    'a11ychecker', 'advlist', 'advcode', 'advtable', 'autolink', 'checklist', 'export',
    'lists', 'link', 'image', 'charmap', 'preview', 'anchor', 'searchreplace', 'visualblocks',
    'powerpaste', 'fullscreen', 'formatpainter', 'insertdatetime', 'media', 'table', 'help', 'wordcount'
  ],
  toolbar: 'undo redo | formatpainter casechange blocks | bold italic backcolor | ' +
    'alignleft aligncenter alignright alignjustify | ' +
    'bullist numlist checklist outdent indent | removeformat | a11ycheck code table help'
});

async function createPost(data) {

  try {
    let responseObject = await fetch("/submitPost", {
      method: 'POST',
      headers: {
        "Accept": 'application/json',
        "Content-Type": 'application/json'
      },
      body: JSON.stringify(data)
    });
    let parsedJSON = await responseObject.json();
    if (parsedJSON.status === "success") {
      document.getElementById("msg").innerHTML = parsedJSON.msg;
      window.location.replace("...");
    } else {
      document.getElementById("msg").innerHTML = "Error,unable to create a post";
    }

  } catch (error) {
  }
}


ready(() => {
  document.getElementById("btn").addEventListener("click", function (e) {
    let unitData = document.getElementById("unitInput").value;
    let streetNumData = document.getElementById("streetNumInput").value;
    let prefixData = document.getElementById("prefixInput").value;
    let streetNameData = document.getElementById("streetNameInput").value;
    let streetTypeData = document.getElementById("streetTypeInput").value;
    let cityData = document.getElementById("cityInput").value;
    let provinceData = document.getElementById("provinceInput").value;
    let reviewData = tinymce.get("mytextarea").getContent();
    if (streetNumData && prefixData && streetNameData && streetTypeData && cityData && provinceData && reviewData) {
      createPost({
        "unit_number": unitData,
        "street_number": streetNumData,
        "prefix": prefixData,
        "street_name": streetNameData,
        "street_type": streetTypeData,
        "city": cityData,
        "province": provinceData,
        "review": reviewData
      });
    } else {
      e.preventDefault();
      document.getElementById("msg").innerText = "Only unit number is optional. Please fill out all other required fields.";
    }
  })
})

function ready(callback) {
  if (document.readyState != "loading") {
    callback();
  } else {
    document.addEventListener("DOMContentLoaded", callback);
  }
}