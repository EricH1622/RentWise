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
      window.location.replace(`/unitView?id=${parsedJSON.location_id}`);
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
      let formData=[streetNumData, streetNameData, cityData, provinceData, reviewData];
      let inputBoxId=["streetNumInput", "streetNameInput","cityInput","provinceInput","mytextarea"];
      for(let i=0;i<=4;i++){
        if(formData[i] === null || formData[i].trim()===""){
          if(i != 4){
            document.getElementById(inputBoxId[i]).setAttribute("style","border: 3px solid #DB3A34");
          }else{
            tinymce.get("mytextarea").getContentAreaContainer().setAttribute("style","border: 3px solid #DB3A34");
          }
        }else{
          if(i != 4){
            document.getElementById(inputBoxId[i]).removeAttribute("style","border: 3px solid #DB3A34");
          }else{
            tinymce.get("mytextarea").getContentAreaContainer().removeAttribute("style","border: 3px solid #DB3A34");
          }
        }
      };
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