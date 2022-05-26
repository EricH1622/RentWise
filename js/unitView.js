console.log("script ran");

// define

let editing = false;

let x = 0;


// get parent element (temp)
// let editButton = document.getElementsByClassName('editBtn');
// editButton[0].addEventListener('click', function openEditer(event) {
//   // parent element id (post id)
//   let parent = (event.target.parentElement.id)
// });


function edit_init() {
  x += 1;
  console.log(document.getElementById("1").querySelector(".rev").innerHTML);  
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
  } else {
    // shouldn't happen
    editing = true;
  }
}

async function submit_data() {
  const data = {"content" : document.getElementById('mytextarea').value,
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
    console.log("success");
  } 
  if (status.status == "fail") {
    // did not update (review is empty)
    console.log("fail");
    document.getElementById('errMsg').innerHTML="Error, review content invalid";
  }
}

async function cancel() {
  editBox.style.display = "none";
  document.getElementById("1").classList.remove('hidden');
  editing = false;
}

// async function submitPost(data) {
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
//     if (parsedJSON.status === "success") {
//       document.getElementById("msg").innerHTML = parsedJSON.msg;
//       window.location.replace(`/unitView?id=${parsedJSON.location_id}`);
//     } else {
//       document.getElementById("msg").innerHTML = "Error,unable to create a post";
//     }

//   } catch (error) {
//   }
// }


// insert edit ui

// define edit ui
// tiny editor filled with content
// image collection + add image option
// cancel / submit buttons
// error message div

