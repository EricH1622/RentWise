"use strict";

// global pointers
let editRow;
let editBox;
let editRowPosition = 0;

let btn_edit;
let btn_done;
let btn_update;
let btn_delete;
let msg_delete;
let btn_cancelDelete;
let btn_deleteFinal;
let response_msg_box;

let editingActive = false;
const saved = []; // original row data being edited.




begin(function() {

  // creating the edit bar
  editRow = document.createElement("tr");
  editRow.className = "edit_row";
  editRow.innerHTML = `<td colspan="7"><div id="editBox"></div></td>`;
  editRow.classList.add("hidden");
  document.querySelector(".data_row").insertAdjacentElement("afterend", editRow);

  // creating edit bar content
  editBox = document.getElementById("editBox");
  editBox.innerHTML =`
  <span class="txt_btn" id="btn_edit">Edit</span>
  <span class="txt_btn" id="btn_done">Done</span>
  <span class="txt_btn" id="btn_update">Update</span>
  <span class="txt_btn" id="btn_delete">Delete</span>
  <span class="txt_btn" id="btn_cancelDelete">Cancel</span>
  <span class="msg_editBox" id="msg_delete">Delete user permanently?</span>
  <span class="txt_btn" id="btn_deleteFinal">Delete</span>
  <span class="msg_editBox" id="response_msg_box">message</span>`;
  
  // setting pointer shortcuts
  btn_edit = document.getElementById("btn_edit");
  btn_done = document.getElementById("btn_done");
  btn_update = document.getElementById("btn_update");
  btn_delete = document.getElementById("btn_delete");
  msg_delete = document.getElementById("msg_delete");
  btn_cancelDelete = document.getElementById("btn_cancelDelete");
  btn_deleteFinal = document.getElementById("btn_deleteFinal");
  response_msg_box = document.getElementById("response_msg_box");

  // setting edit bar button functions
  btn_edit.addEventListener("click", btn_edit_Do);
  btn_done.addEventListener("click", btn_done_Do);
  btn_update.addEventListener("click", btn_update_Do);
  btn_delete.addEventListener("click", btn_delete_Do);
  btn_cancelDelete.addEventListener("click", btn_cancelDelete_Do);
  btn_deleteFinal.addEventListener("click", btn_deleteFinal_Do);

  // setting clickability for all data rows
  let data_rows = document.getElementsByClassName("data_row");
  for (let i = 0; i < data_rows.length; i++) {
    data_rows[i].addEventListener("click", toggle_editRow);
  }
});


function toggle_editRow() {
  if (editingActive) {
    return;
  }
  if (editRowPosition == this.id) {
    editRow.classList.toggle("hidden");
  } else {
    move_editRow(this.id);
  }
}


function move_editRow(rowID) {
  resetEditBox();
  document.getElementById(rowID).insertAdjacentElement("afterend", editRow);
  editRow.classList.remove("hidden");
  editRowPosition = rowID;
}

function btn_edit_Do() {
  editingActive = true;

  btn_edit.classList.add("hidden");
  btn_delete.classList.add("hidden");
  btn_done.classList.remove("hidden");
  btn_update.classList.remove("hidden");

  const td_list = document.querySelectorAll(`#${editRowPosition} > td`);
  for (let i = 0; i < td_list.length; i++) {
    saved[i] = td_list[i].innerHTML;
  }
  td_list[1].innerHTML = `<input type="text" id="inp_username" value="${saved[1]}"/>`;
  td_list[2].innerHTML = `<input type="text" id="inp_firstname" value="${saved[2]}"/>`;
  td_list[3].innerHTML = `<input type="text" id="inp_lastname" value="${saved[3]}"/>`;
  td_list[4].innerHTML = `<input type="email" id="inp_email" value="${saved[4]}"/>`;
  td_list[5].innerHTML = `<input type="text" id="inp_password" value="${saved[5]}"/>`;
  td_list[6].innerHTML = `<input type="number" id="inp_usertype" min="0" max="1" value="${saved[6]}"/>`;
}


function btn_done_Do() {
  const td_list = document.querySelectorAll(`#${editRowPosition} > td`);
  for (let i = 1; i < td_list.length; i++) {
    td_list[i].innerHTML = saved[i];
    saved[i] = null;
  }
  editingActive = false;
  resetEditBox();
}


async function btn_update_Do() {
  let username = document.getElementById("inp_username").value;
  let firstname = document.getElementById("inp_firstname").value;
  let lastname = document.getElementById("inp_lastname").value;
  let email = document.getElementById("inp_email").value;
  let password = document.getElementById("inp_password").value;
  let usertype = document.getElementById("inp_usertype").value;

  let obj =  {"userID": saved[0],
              "username": username,
              "firstname": firstname,
              "lastname": lastname,
              "email": email,
              "password": password,
              "usertype": usertype};
  try {
    let res = await fetch("/update_user_data", {
      method: 'POST',
      headers: {
        "Accept": 'application/json',
        "Content-Type": 'application/json'
      },
      body: JSON.stringify(obj)
    });
    let parsedJSON = await res.json();
    response_msg_box.innerHTML = parsedJSON.msg;
    
    if (parsedJSON.status == "success") {
      saved[1] = username;
      saved[2] = firstname;
      saved[3] = lastname;
      saved[4] = email;
      saved[5] = password;
      saved[6] = usertype;
    }
  }
  catch (error){
    response_msg_box.innerHTML = error;
  }
}


function btn_delete_Do() {
  btn_edit.classList.add("hidden");
  btn_delete.classList.add("hidden");
  msg_delete.classList.remove("hidden");
  btn_cancelDelete.classList.remove("hidden");
  btn_deleteFinal.classList.remove("hidden");
}


function btn_cancelDelete_Do() {
  resetEditBox();
}


async function btn_deleteFinal_Do() {
  let userID = document.querySelector(`#${editRowPosition} > td`);
  userID = userID.innerHTML;

  let obj =  {"userID": userID}
  try {
    let res = await fetch("/delete_user", {
      method: 'POST',
      headers: {
        "Accept": 'application/json',
        "Content-Type": 'application/json'
      },
      body: JSON.stringify(obj)
    });
    let parsedJSON = await res.json();
    
    if (parsedJSON.status == "success") {
      document.getElementById(editRowPosition).remove();
      editRow.classList.add("hidden");
      document.querySelector(".data_row").insertAdjacentElement("afterend", editRow);
      resetEditBox();
    } else {
      response_msg_box.innerHTML = parsedJSON.msg;
    }
  }
  catch (error){
    response_msg_box.innerHTML = error;
  }
}


function resetEditBox() {
  btn_edit.classList.remove("hidden");
  btn_delete.classList.remove("hidden");
  btn_done.classList.add("hidden");
  btn_update.classList.add("hidden");
  msg_delete.classList.add("hidden");
  btn_cancelDelete.classList.add("hidden");
  btn_deleteFinal.classList.add("hidden");

  response_msg_box.innerHTML = "";
}





function begin(callback) {
  if (document.readyState != "loading") {
      callback();
  } else {
      document.addEventListener("DOMContentLoaded", callback);
  }
}