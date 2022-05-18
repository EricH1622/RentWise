"use strict";
console.log(new Date().toLocaleString());
tinymce.init({
  selector: '#mytextarea',
  plugins: [
    'a11ychecker','advlist','advcode','advtable','autolink','checklist','export',
    'lists','link','image','charmap','preview','anchor','searchreplace','visualblocks',
    'powerpaste','fullscreen','formatpainter','insertdatetime','media','table','help','wordcount'
  ],
  toolbar: 'undo redo | formatpainter casechange blocks | bold italic backcolor | ' +
    'alignleft aligncenter alignright alignjustify | ' +
    'bullist numlist checklist outdent indent | removeformat | a11ycheck code table help'
});

// async function createPost(data) {
  
//   try {
//     let responseObject = await fetch("/submitPost", {
//       method: 'POST',
//       headers: {
//         "Accept": 'application/json',
//         "Content-Type": 'application/json'
//       },
//       body: JSON.stringify(data)
//     });
//     let parsedJSON = await responseObject.json();
//     if (parsedJSON.status === "fail") {
//       document.getElementById("createErrorMsg").innerHTML = parsedJSON.msg;
//     } else {
//       window.location.replace("...");
//     }

//   } catch (error) {
//   }
// }


// ready(()=>{
//   document.getElementById("btn").addEventListener("click", function(e) {
//     if((document.getElementById("streetNum").value) && (document.getElementById("streetName").value) && (document.getElementById("city").value) && (document.getElementById("province").value) && (document.getElementById("country").value) & (document.getElementById("country").value)){
//       createAccount({
//         "street_number": document.getElementById("streetNumInput").value,
//         "street_name": document.getElementById("streetNameInput").value,
//         "city": document.getElementById("cityInput").value,
//         "province":document.getElementById("provinceInput").value,
//         "country":document.getElementById("countryInput").value
//       });
//     } else {
//       e.preventDefault();
//       document.getElementById("createErrorMsg").innerText = "Please fill out all required fields.";
//     }
//   })
// })

// function ready(callback) {
//   if (document.readyState != "loading") {
//     callback();
//   } else {
//     document.addEventListener("DOMContentLoaded", callback);
//   }
// }
