"use strict";

// REQUIRES
const express = require("express");
const session = require("express-session");
const app = express();
const fs = require("fs");
const mysql = require("mysql2/promise");
const multer = require("multer");
const {JSDOM} = require('jsdom');
const sanitizeHtml = require('sanitize-html');

app.use("/js", express.static("./js"));
app.use("/css", express.static("./css"));
app.use("/assets", express.static("./assets"));

app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));


app.use(session({
  secret: "secret phrase for encoding",
  name: "BBY37-SessionID",
  resave: false,
  saveUninitialized: true
}));


app.get("/", function (req, res) {
  if (req.session.loggedIn) {
    res.redirect("/profile");
  } else {
    let doc = fs.readFileSync("./html/index.html", "utf8");
    let docDOM = new JSDOM(doc);
    docDOM.window.document.getElementById("nav").innerHTML = getNavBar(req);
    res.send(docDOM.serialize());
  }
});

app.get("/login", function (req, res) {
  if (req.session.loggedIn) {
    res.redirect("/profile");
  } else {
    let doc = fs.readFileSync("./html/login.html", "utf8");
    let docDOM = new JSDOM(doc);
    docDOM.window.document.getElementById("nav").innerHTML = getNavBar(req);
    res.send(docDOM.serialize());
  }
});

app.get("/createAccount", function (req, res) {
  if (req.session.loggedIn) {
    res.redirect("/profile");
  } else {
    let doc = fs.readFileSync("./html/createAccount.html", "utf8");
    let docDOM = new JSDOM(doc);
    docDOM.window.document.getElementById("nav").innerHTML = getNavBar(req);
    res.send(docDOM.serialize());
  }
});

app.get("/logout", function (req, res) {
  if (req.session) {
    req.session.destroy(function (error) {
      if (error) {
        res.status(400).send("Error logging out.")
      } else {
        res.redirect("/"); // session deleted, redirect to root
      }
    });
  } else {
    res.redirect("/");
  }
});

app.get("/profile", function (req, res) {
  sendProfilePage(req, res);
});

app.get("/admin", function (req, res) {
  if (req.session.loggedIn && req.session.userlevel == 1) {
    sendAdminPage(req, res);
  } else {
    res.redirect("/");
  }
});


//dynamic navbars
function getNavBar(req) {
  if (req.session.loggedIn) {
    if (req.session.userlevel == 0) {
      return `<input type="checkbox" id="check">
      <label for="check" class="checkbtn">
          <i><img src="/assets/images/menuIcon.png" class="hamburger"/></i>
      </label>
      <div class="logo"><img id="logo1" src="/assets/images/Rentwise_Logo.png"></div>
      <ul>
          <li><a href="/home">Search</a></li>
          <li><a href="/createPost">Create Post</a></li>
          <li><a href="/profile">Profile</a></li>
          <li><a href="/userTimeline">Timeline</a></li>
          <li><a href="/logout" id="logout">Logout</a></li>
      </ul>`
    } else {
      return `<input type="checkbox" id="check">
      <label for="check" class="checkbtn">
          <i><img src="/assets/images/menuIcon.png" class="hamburger"/></i>
      </label>
      <div class="logo"><img id="logo1" src="/assets/images/Rentwise_Logo.png"></div>
      <ul>
          <li><a href="/admin">Admin</a></li>
          <li><a href="/home">Search</a></li>
          <li><a href="/createPost">Create Post</a></li>
          <li><a href="/profile">Profile</a></li>
          <li><a href="/userTimeline">Timeline</a></li>
          <li><a href="/logout" id="logout">Logout</a></li>
      </ul>`
    }
  } else {
    return `<div class="logo"><img id="logo1" src="/assets/images/Rentwise_Logo.png"></div>`
  }
}



async function sendProfilePage(req, res) {
  if (req.session.loggedIn) {
    let doc = fs.readFileSync("./html/profile.html", "utf8");
    let docDOM = new JSDOM(doc);
    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "COMP2800",
      multipleStatements: true
    });
    connection.connect();
    const [rows, fields] = await connection.execute(
      "SELECT first_name, last_name, username, email_address, password FROM BBY_37_user " +
      "WHERE BBY_37_user.user_id = " + req.session.userid);
    await connection.end();
    docDOM.window.document.getElementById("firstName").setAttribute("value", rows[0].first_name);
    docDOM.window.document.getElementById("lastName").setAttribute("value", rows[0].last_name);
    docDOM.window.document.getElementById("username").setAttribute("value", rows[0].username);
    docDOM.window.document.getElementById("password").setAttribute("value", rows[0].password);
    docDOM.window.document.getElementById("email").setAttribute("value", rows[0].email_address);

    docDOM.window.document.getElementById("nav").innerHTML = getNavBar(req);
    docDOM.window.document.getElementById("profilePhoto").src = "/assets/uploads/profilePicture_" + req.session.userid;

    res.send(docDOM.serialize());
  } else {
    // not logged in - no session and no access, redirect to root.
    res.redirect("/");
  }
}

app.get("/unitView", function (req, res) {
  if (req.session.loggedIn) {
    sendReviews(req, res);
  } else {
    res.redirect("/login")
  }
});

async function sendReviews(req, res) {
  let address_id = req.query["id"];
  let doc = fs.readFileSync("./html/unitView.html", "utf8");
  let docDOM = new JSDOM(doc);
  const connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "COMP2800",
    multipleStatements: true
  });
  // replace unit_id with selected option
  let unit_id = address_id;

  connection.connect();
  // get relative data and save into constants

  // posts
  const [rows, fields] = await connection.execute("SELECT * FROM BBY_37_post WHERE BBY_37_post.location_id = " + unit_id
  );

  // addresses
  const [rows2, fields2] = await connection.execute("SELECT * FROM BBY_37_location WHERE BBY_37_location.location_id = " + unit_id
  );

  // users
  let u_name = [];
  // for each post, the user id is used to query the user db for usernames
  for (let k = 0; k < rows.length; k++) {
    const [rows3, fields3] = await connection.execute("SELECT * FROM BBY_37_user WHERE BBY_37_user.user_id = " + rows[k].user_id
    );
    u_name[k] = rows3[0].username;
  }

  //Remove "N/A" prefix
  let prefixStr;
  if(rows2[0].prefix == "N/A"){
    prefixStr = "";
  } else {
    prefixStr = rows2[0].prefix;
  }

  // load address into page
  let address = rows2[0].unit_number + "-" + rows2[0].street_number + " " + rows2[0].street_name + " " + rows2[0].street_type + " " + prefixStr + " " + rows2[0].city + " " + rows2[0].province; 

  await connection.end();
  let currentReview = "";
  // empty reviews div
  docDOM.window.document.getElementById("reviews").innerHTML = currentReview;
  for (let j = 0; j < rows.length; j++) {
    // for each row, make a new review
    currentReview += "<div class='review'>";
    currentReview += "<div class='name'><strong>" + u_name[j] + "</strong></div>";
    currentReview += "<div class='rev'><strong>" + rows[j].content + "</strong></div>";
    currentReview += "<div class='createTime'> Original Post: " + rows[j].date_created + "</div>";
    if ((rows[j].last_edited_date != "Invalid Date") && (rows[j].last_edited_date != null)) {
      currentReview += "<div class='editTime'> Last edit:" + rows[j].last_edited_date + "</div>";
    }
    currentReview += "<div class='images'><img id='photo1' src='" + rows[j].photo1 + "'></img></div>";
    currentReview += "</div>";
  }
  docDOM.window.document.getElementById("address").innerHTML= address;
  docDOM.window.document.getElementById("reviews").innerHTML += currentReview;
  docDOM.window.document.getElementById("nav").innerHTML = getNavBar(req);
  res.send(docDOM.serialize());
}

app.get("/userTimeline", function (req, res) {
  if (req.session.loggedIn) {
    sendHistory(req, res);
  } else {
    res.redirect("/login")
  }
});

async function sendHistory(req, res) {
  let doc = fs.readFileSync("./html/userTimeLine.html", "utf8");
  let docDOM = new JSDOM(doc);
  const connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "COMP2800",
    multipleStatements: true
  });

  connection.connect();

  // query for relative data from DB
  const [rows, fields] = await connection.execute("SELECT BBY_37_location.unit_number, BBY_37_location.street_number, BBY_37_location.prefix, BBY_37_location.street_name, BBY_37_location.street_type, BBY_37_location.city, BBY_37_location.province, BBY_37_post.user_id, BBY_37_post.date_created, BBY_37_post.last_edited_date, BBY_37_post.content, BBY_37_post.photo1 FROM BBY_37_post INNER JOIN BBY_37_location ON BBY_37_location.location_id=BBY_37_post.location_id WHERE user_id=" + req.session.userid
  );

  await connection.end();
  let historyItems = ""; 
  // empty reviews div
  docDOM.window.document.getElementById("userHistory").innerHTML = historyItems;

  // check for if user has no posts
  if (rows[0].street_number === undefined) {
    docDOM.window.document.getElementById("userHistory").innerHTML += "no posts";
    // unecessary check?
  } else if (rows[0].street_number != null) {
    for (let j = rows.length - 1; j > -1; j--) {
      // for each item, define the address
      let address = "";
      if (rows[j].unit_number != null) {
        address = rows[j].unit_number + " " + rows[j].street_number + " " + rows[j].street_name + " " + rows[j].street_type + " " + rows[j].prefix + " " + rows[j].city + " " + rows[j].province;
      } else {
        address = rows[j].street_number + " " + rows[j].street_name + " " + rows[j].street_type + " " + rows[j].prefix + " " + rows[j].city + " " + rows[j].province;
      }
      // for each row, make a new review
      historyItems += "<div class='timeLineItem'>";
      historyItems += "<div class='address'>" + address + "</div>";
      if (rows[j].photo1 != null) {
        historyItems += "<div class='image'><img id='photo1' src=' " + rows[j].photo1 + "'></div>";
      }
      historyItems += "<div class='review'>" + rows[j].content + "</div>";
      historyItems += "<div class='message'></div>";
      historyItems += "<div class='initPostTime'>Posted: " + rows[j].date_created + "</div>";
      if (rows[j].last_edited_date != "Invalid Date") {
        historyItems += "<div class='lastEditTime'>Edited: " + rows[j].last_edited_date + "</div>";
      } else {
        historyItems += "<div class='lastEditTime'></div>";
      }
      historyItems += "<div class='editBtn'></div>";
      historyItems += "</div>";
      }
    docDOM.window.document.getElementById("userHistory").innerHTML = historyItems;
  } else {
    // error 
  }
      res.send(docDOM.serialize());
}

app.get("/results", function (req, res) {
  if (req.session.loggedIn) {
    executeSearch(req, res);
  } else {
    res.redirect("/");
  }
});

async function sendAdminPage(req, res) {
  let doc = fs.readFileSync("./html/admin.html", "utf8");
  let docDOM = new JSDOM(doc);
  const connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "COMP2800",
    multipleStatements: true
  });
  connection.connect();
  const [rows, fields] = await connection.execute("SELECT * FROM BBY_37_user ");
  await connection.end();
  // `user_id`, `username`, `first_name`, `last_name`, `email_address`, `password`, `role_id`
  let table = "<table><tr>" +
    "<th>ID</th>" +
    "<th>Username</th>" +
    "<th>First Name</th>" +
    "<th>Last Name</th>" +
    "<th>Email</th>" +
    "<th>Password</th>" +
    "<th>User Type</th></tr>";
  for (let i = 0; i < rows.length; i++) {
    table += `<tr id="tr${rows[i].user_id}" class="data_row"><td>` +
      rows[i].user_id + "</td><td>" +
      rows[i].username + "</td><td>" +
      rows[i].first_name + "</td><td>" +
      rows[i].last_name + "</td><td>" +
      rows[i].email_address + "</td><td>" +
      rows[i].password + "</td><td>" +
      rows[i].role_id + "</td></tr>";
  }
  table += "</table>";
  docDOM.window.document.getElementById("tableContainer").innerHTML = table;
  docDOM.window.document.getElementById("nav").innerHTML = getNavBar(req);

  res.send(docDOM.serialize());
}

app.post("/login", function (req, res) {
  authenticateUser(req, res);
});

app.post("/signup", function (req, res) {
  res.setHeader("Content-Type", "application/json");
  createUser(req, res);
});

app.post('/update-profile', function (req, res) {
  res.setHeader('Content-Type', 'application/json');
  editUserProfile(req, res);
});

app.post('/search', function (req, res) {
  storeSearch(req, res);
});

async function editUserProfile(req, res) {
  if (req.session.loggedIn) {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'COMP2800',
      multipleStatements: true
    });
    connection.connect();

    if(!valid_username(req.body.username)){
      res.send({
        status: "fail",
        msg: "Invalid username."
      });
      return;
    }
    if(!valid_password(req.body.password)){
      res.send({
        status: "fail",
        msg: "Invalid password."
      });
      return;
    }
    if(!valid_name(req.body.firstName)){
      res.send({
        status: "fail",
        msg: "Invalid first name."
      });
      return;
    }
    if(!valid_name(req.body.lastName)){
      res.send({
        status: "fail",
        msg: "Invalid last name."
      });
      return;
    }
    if(!valid_email(req.body.email)){
      res.send({
        status: "fail",
        msg: "Invalid Email Address."
      });
      return;
    }
    if(!valid_email(req.body.email)){
      res.send({
        status: "fail",
        msg: "Invalid Email Address."
      });
      return;
    }
    if(!valid_userID(req.session.userid)){
      res.send({
        status: "fail",
        msg: "Invalid User ID."
      });
      return;
    }

    connection.query('UPDATE BBY_37_user SET username = ?, first_name =?, last_name = ?,email_address = ?,password = ? WHERE user_id = ?',
      [req.body.username, req.body.firstName, req.body.lastName, req.body.email, req.body.password, req.session.userid])
    connection.end();
    res.send({
      status: "success",
      msg: "Profile info updated."
    });
  } else {
    res.redirect("/");
  }
}

async function storeSearch(req, res) {
  res.setHeader("Content-Type", "application/json");
  if (req.session.loggedIn) {
    req.session.unit = req.body.unit;
    req.session.streetNum = req.body.streetNum;
    req.session.prefix = req.body.prefix;
    req.session.streetName = req.body.streetName;
    req.session.streetType = req.body.streetType;
    req.session.city = req.body.city;
    req.session.province = req.body.province;
    res.send({
      status: "success",
      msg: "Search parameters stored."
    });
  } else {
    res.send({
      status: "fail",
      msg: "Not logged in."
    });
  }
}

async function executeSearch(req, res) {
  if (req.session.loggedIn) {
    let doc = fs.readFileSync("./html/results.html", "utf8");
    let docDOM = new JSDOM(doc);

    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'COMP2800',
      multipleStatements: true
    });
    connection.connect();

    let query = `SELECT * FROM BBY_37_location WHERE 
      unit_number LIKE ? AND 
      street_number LIKE ? AND 
      prefix LIKE ? AND 
      street_name LIKE ? AND 
      street_type LIKE ? AND 
      city LIKE ? AND 
      province LIKE ?`;
    
    let values = [req.session.unit, req.session.streetNum, req.session.prefix, req.session.streetName, req.session.streetType, req.session.city, req.session.province];

    const [rows, fields] = await connection.query(query, values);

    if(rows.length > 0){
      let query2 = `SELECT COUNT(post_id) AS post_count FROM BBY_37_post WHERE location_id = ?`;
      let rows2;
      let fields2;
      for (let i = 0; i < rows.length; i++) {
        [rows2, fields2] = await connection.query(query2, [rows[i].location_id]);

        let postNumStr;
        if(rows2.length == 0){
          postNumStr = "There are 0 posts for this address.";
        } else if(rows2[0].post_count == 1){
          postNumStr = "There is 1 post for this address.";
        } else {
          postNumStr = "There are " + rows2[0].post_count + " posts for this address.";
        }

        let prefixStr;
        if(rows[i].prefix == "%"){
          prefixStr = "";
        } else {
          prefixStr = rows[i].prefix;
        }
        

        docDOM.window.document.getElementById("results").innerHTML += `
        <div class="resultBox">
                    <div class="resultHead">
                        <h2>` + rows[i].unit_number + "-" + rows[i].street_number + " " + prefixStr + " " + rows[i].street_name + " " + rows[i].street_type + " " + `</h2>
                        <p class="address">` + rows[i].city + ", " + rows[i].province + `</p>
                    </div>
                    <div class="resultBody">
                        <p class="description">` + postNumStr + `</p>
                        <div>
                            <a class="resultButton more" href="/unitview?id=` + rows[i].location_id + `">See more</a>
                        </div>
                    </div>
        </div>`;

      }
    } else {
      docDOM.window.document.getElementById("results").innerHTML += `
      <div id="noResults">
        <h1>No results found!</h1>
        <p>We couldn't find any results for that search, sorry!</p>
        <p>Maybe you'd like to make a post for it though?</p>
        <button class="resultButton create" type="button">Create a post</button>
      </div>`;
    }
    await connection.end();

    docDOM.window.document.getElementById("nav").innerHTML = getNavBar(req);
    res.send(docDOM.serialize());
  } else {
    res.redirect("/");
  }
}

async function authenticateUser(req, res) {
  const connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "COMP2800",
    multipleStatements: true
  });
  connection.connect();
  const [rows, fields] = await connection.execute(
    "SELECT user_id, role_id FROM BBY_37_user WHERE BBY_37_user.username = ? AND BBY_37_user.password = ?",
    [req.body.username, req.body.password]);

  await connection.end();

  res.setHeader("Content-Type", "application/json");
  if (rows.length == 1) {
    // user authenticated, create a session
    req.session.loggedIn = true;
    req.session.userlevel = rows[0].role_id;
    req.session.userid = rows[0].user_id;
    req.session.save(function (err) {});
    res.send({
      status: "success",
      msg: "Logged in."
    });
  } else {
    res.send({
      status: "fail",
      msg: "User account not found."
    });
  }
}

async function createUser(req, res) {
  const connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "COMP2800",
    multipleStatements: true
  });
  connection.connect();

  //Checks for valid user values
  if(!valid_username(req.body.username)){
    res.send({
      status: "fail",
      msg: "Invalid username."
    });
    return;
  }
  if(!valid_password(req.body.password)){
    res.send({
      status: "fail",
      msg: "Invalid password."
    });
    return;
  }
  if(!valid_name(req.body.firstName)){
    res.send({
      status: "fail",
      msg: "Invalid first name."
    });
    return;
  }

  if(!valid_name(req.body.lastName)){
    res.send({
      status: "fail",
      msg: "Invalid last name."
    });
    return;
  }

  if(!valid_email(req.body.email)){
    res.send({
      status: "fail",
      msg: "Invalid Email Address."
    });
    return;
  }
  if(!valid_usertype(req.body.role_id)){
    res.send({
      status: "fail",
      msg: "Invalid user type."
    });
    return;
  }

  connection.query('INSERT INTO BBY_37_user (username,password,first_name,last_name,email_address,role_id) values (?, ?, ?, ?, ?, ?)',
    [req.body.username, req.body.password, req.body.firstName, req.body.lastName, req.body.email, req.body.role_id]);
  connection.end();
  res.send({
    status: "success",
    msg: "Account added."
  });
}


const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "./assets/uploads/")
  },
  filename: function (req, file, callback) {
    callback(null, "profilePicture_" + req.session.userid);
  }
});
const upload = multer({
  storage: storage
});


app.post('/upload-images', upload.array("files"), function (req, res) {


  for (let i = 0; i < req.files.length; i++) {
    req.files[i].filename = req.files[i].originalname;
  }

});

app.post("/delete_user", function (req, res) {
  if (req.session.loggedIn && req.session.userlevel == 1) {
    deleteUser(req, res);
  } else {
    res.send({
      status: "fail",
      msg: "You don't have admin rights."
    });
  }
});


async function deleteUser(req, res) {
  const connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "COMP2800",
    multipleStatements: true
  });
  connection.connect();

  let [rows, fields] = await connection.query(
    "SELECT role_id FROM BBY_37_user WHERE BBY_37_user.user_id = ?",
    [req.body.userID]);

  if (rows[0].role_id == 0) {
    doDeleteUser(req, res);
  } else {
    let [rows2, fields2] = await connection.query(
      "SELECT user_id FROM BBY_37_user WHERE BBY_37_user.role_id = 1");

    if (rows2.length < 2) { //last admin
      res.send({
        status: "fail",
        msg: "Last admin account. Cannot remove admin."
      });
    } else {
      doUpdateUser(req, res);
    }
  }
  await connection.end();
}


async function doDeleteUser(req, res) {
  const connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "COMP2800",
    multipleStatements: true
  });
  connection.connect();
  
  await connection.query('DELETE FROM BBY_37_user WHERE BBY_37_user.user_id = ?',
    [req.body.userID]);
  await connection.end();
  res.send({
    status: "success",
    msg: "Account deleted."
  });
}


app.post("/update_user_data", function (req, res) {
  if (req.session.loggedIn && req.session.userlevel == 1) {
    adminUpdateUsers(req, res);
  } else {
    res.send({
      status: "fail",
      msg: "You don't have admin rights."
    });
  }
});

async function adminUpdateUsers(req, res) {

  const connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "COMP2800",
    multipleStatements: true
  });
  connection.connect();

  let [rows, fields] = await connection.query(
    "SELECT user_id, role_id FROM BBY_37_user WHERE BBY_37_user.user_id = ?",
    [req.body.userID]);

  if (rows.length == 1) { //ID exists and is unique
    if ((rows[0].role_id == 0) || rows[0].role_id == 1 && req.body.usertype == 1) {
      doUpdateUser(req, res);
    } else {
      let [rows2, fields2] = await connection.query(
        "SELECT user_id FROM BBY_37_user WHERE BBY_37_user.role_id = 1");

      if (rows2.length < 2) { //last admin
        res.send({
          status: "fail",
          msg: "Last admin account. Cannot remove admin privilege."
        });
      } else {
        doUpdateUser(req, res);
      }
    }
  } else {
    res.send({
      status: "fail",
      msg: "User ID doesn't exist or has duplicates."
    });
  }

  await connection.end();
}

async function doUpdateUser(req, res) {
  const connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "COMP2800",
    multipleStatements: true
  });
  connection.connect();

  if(!valid_username(req.body.username)){
    res.send({
      status: "fail",
      msg: "Invalid username."
    });
    return;
  }
  if(!valid_password(req.body.password)){
    res.send({
      status: "fail",
      msg: "Invalid password."
    });
    return;
  }
  if(!valid_name(req.body.firstname)){
    res.send({
      status: "fail",
      msg: "Invalid first name."
    });
    return;
  }
  if(!valid_name(req.body.lastname)){
    res.send({
      status: "fail",
      msg: "Invalid last name."
    });
    return;
  }
  if(!valid_email(req.body.email)){
    res.send({
      status: "fail",
      msg: "Invalid Email Address."
    });
    return;
  }
  if(!valid_usertype(req.body.usertype)){
    res.send({
      status: "fail",
      msg: "Invalid user type."
    });
    return;
  }

  await connection.query('UPDATE BBY_37_user ' +
    'SET username = ?, first_name = ?, last_name = ?, email_address = ?, password = ?, role_id = ? ' +
    'WHERE BBY_37_user.user_id = ?',
    [req.body.username, req.body.firstname, req.body.lastname, req.body.email,
      req.body.password, req.body.usertype, req.body.userID
    ]);
  connection.end();
  res.send({
    status: "success",
    msg: "User data updated."
  });
}


app.post("/add_user", function (req, res) {
  if (req.session.loggedIn && req.session.userlevel == 1) {
    adminAddUser(req, res);
  } else {
    res.send({
      status: "fail",
      msg: "You don't have admin rights."
    });
  }
});


async function adminAddUser(req, res) {
  const connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "COMP2800",
    multipleStatements: true
  });
  connection.connect();
  // check if username exists
  let [rows, fields] = await connection.query(
    "SELECT user_id FROM BBY_37_user WHERE BBY_37_user.username = ?",
    [req.body.username]);

  if (rows.length > 0) {
    res.send({
      status: "fail",
      msg: "Username already exists."
    });
    connection.end();
    return;
  }

  //Checks for valid user values
  if(!valid_username(req.body.username)){
    res.send({
      status: "fail",
      msg: "Invalid username."
    });
    return;
  }
  if(!valid_password(req.body.password)){
    res.send({
      status: "fail",
      msg: "Invalid password."
    });
    return;
  }
  if(!valid_name(req.body.firstName)){
    res.send({
      status: "fail",
      msg: "Invalid first name."
    });
    return;
  }
  if(!valid_name(req.body.lastName)){
    res.send({
      status: "fail",
      msg: "Invalid last name."
    });
    return;
  }
  if(!valid_email(req.body.email)){
    res.send({
      status: "fail",
      msg: "Invalid Email Address."
    });
    return;
  }
  if(!valid_usertype(req.body.role_id)){
    res.send({
      status: "fail",
      msg: "Invalid user type."
    });
    return;
  }

  await connection.query('INSERT INTO BBY_37_user (username, first_name, last_name, email_address, password, role_id) values (?, ?, ?, ?, ?, ?)',
    [req.body.username, req.body.firstname, req.body.lastname, req.body.email, req.body.password, req.body.usertype]);

  [rows, fields] = await connection.query(
    "SELECT * FROM BBY_37_user WHERE BBY_37_user.username = ?",
    [req.body.username]);

  if (rows.length < 1) {
    res.send({
      status: "fail",
      msg: "Error: Was not able to retrieve the username from database after setting."
    });
    connection.end();
    return;
  }

  connection.end();
  res.send({
    status: "success",
    msg: "User added.",
    userID: rows[0].user_id,
    username: rows[0].username,
    firstname: rows[0].first_name,
    lastname: rows[0].last_name,
    email: rows[0].email_address,
    password: rows[0].password,
    usertype: rows[0].role_id
  });
}

app.get("/home",function (req, res) {
  if (req.session.loggedIn) {
    let doc = fs.readFileSync("./html/home.html", "utf8");
    let docDOM = new JSDOM(doc);
    docDOM.window.document.getElementById("nav").innerHTML = getNavBar(req);
    res.send(docDOM.serialize());
  }else{
    res.redirect("/login");
  }
})

app.get("/createPost", function (req, res) {
  if (req.session.loggedIn) {
    let doc = fs.readFileSync("./html/createPost.html", "utf8");
    let docDOM = new JSDOM(doc);
    docDOM.window.document.getElementById("nav").innerHTML = getNavBar(req);
    res.send(docDOM.serialize());
  }else{
    res.redirect("/login");
  }
});

app.post("/submitPost", function (req,res){
  if (req.session.loggedIn) {
    submitPost(req,res);
  }else{
    res.redirect("/login");
  }
});
async function submitPost(req,res){
  const connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "COMP2800",
    multipleStatements: true
  });
  connection.connect();

  //Read into database to see if the address entered by user already exsits
  const [rows, fields] = await connection.query(
    "SELECT * FROM BBY_37_location WHERE BBY_37_location.unit_number = ? AND BBY_37_location.street_number = ? AND BBY_37_location.prefix = ? AND BBY_37_location.street_name = ? AND BBY_37_location.street_type = ? AND BBY_37_location.city = ? AND BBY_37_location.province = ?",
    [req.body.unit_number, req.body.street_number, req.body.prefix, req.body.street_name, req.body.street_type, req.body.city, req.body.province]);

    //if the address does not exist in the database, create a new entry in the location table, grab that location id and add a new entry to the post table
    var locationid;
    const sanitizedReview = sanitizeHtml(req.body.review);
    
    if (rows.length === 0) {
      await connection.execute("INSERT INTO BBY_37_location (unit_number,street_number,prefix,street_name,street_type,city,province) values (?, ?, ?, ?, ?, ?, ?)",[req.body.unit_number, req.body.street_number, req.body.prefix, req.body.street_name, req.body.street_type, req.body.city, req.body.province]);
      const [row, fields] = await connection.query(
        "SELECT * FROM BBY_37_location WHERE BBY_37_location.unit_number = ? AND BBY_37_location.street_number = ? AND BBY_37_location.prefix = ? AND BBY_37_location.street_name = ? AND BBY_37_location.street_type = ? AND BBY_37_location.city = ? AND BBY_37_location.province = ?",
        [req.body.unit_number, req.body.street_number, req.body.prefix, req.body.street_name, req.body.street_type, req.body.city, req.body.province]);

      //Grab the location_id of the new address added to location table
      locationid = row[0].location_id;

      if(!valid_userID(req.session.userid)){
        res.send({
          status: "fail",
          msg: "Invalid User ID."
        });
        return;
      }

      await connection.execute("INSERT INTO BBY_37_post (user_id, date_created, content, location_id) values (?, ?, ?, ?)",[req.session.userid,new Date(),sanitizedReview,locationid]);
      await connection.end();

      //if the address already exist, only add the review with the user id and the location id of this address
    }else{
      if(!valid_userID(req.session.userid)){
        res.send({
          status: "fail",
          msg: "Invalid User ID."
        });
        return;
      }

      locationid = rows[0].location_id;
      await connection.execute("INSERT INTO BBY_37_post (user_id, date_created, content, location_id) values (?, ?, ?, ?)",[req.session.userid,new Date(),sanitizedReview,locationid]);
      await connection.end();
    }
    res.send({
      status:"success",
      message:"The post has been created.",
      location_id:locationid
    }); 
}

function valid_email (email) {
  // allowed: a-z A-Z 0-9 _-.@
  // email should be trimmed before sending here.

  if (!email) return false;
  if (email.length > 100) return false;

  const emailParts = email.split('@');
  if (emailParts.length !== 2  ||
      emailParts[0].length < 1 ||
      emailParts[1].length < 3 ||
      !emailParts[1].includes(".") ) {
    return false;
  }

  const charList = email.split("");
  if (charList[0] == '.' || charList[charList.length - 1] == '.') return false;

  for (let i = 0; i < charList.length; i++) {
    let char = charList[i];
    if ((char >= 'a' && char <= 'z') ||
        (char >= '@' && char <= 'Z') ||
        (char >= '0' && char <= '9') ||
        char == '-' ||
        char == '_' ||
        char == '.' ) {
      // continue...
    } else {
      return false;
    }
  }
  return true;
}


function valid_username (username) {
  // allowed: a-z A-Z 0-9 _-.
  // username should be trimmed before sending here.

  if (!username) return false;
  if (username.length > 50) return false;

  const charList = username.split("");
  if (charList[0] == '.' || charList[charList.length - 1] == '.') return false;

  for (let i = 0; i < charList.length; i++) {
    let char = charList[i];
    if ((char >= 'a' && char <= 'z') ||
        (char >= 'A' && char <= 'Z') ||
        (char >= '0' && char <= '9') ||
        char == '-' ||
        char == '_' ||
        char == '.' ) {
      // continue...
    } else {
      return false;
    }
  }
  return true;
}


function valid_password (password) {
  // * allowed: A-Z a-z 0-9 ~!@#$%^&* -=_+,. space
  // * password should NOT be trimmed before sending here.
  // * password can contain consecutive spaces, therefore when displayed on page,
  //   it must be put in <pre> or <code> tags.

  if (!password) return false;
  if (password.length > 100) return false;

  const charList = password.split("");
  if (charList[0] == " " || charList[charList.length - 1] == " ") return false;

  for (let i = 0; i < charList.length; i++) {
    let char = charList[i];
    if ((char >= 'a' && char <= 'z') ||
        (char >= '@' && char <= 'Z') ||
        (char >= '0' && char <= '9') ||
        (char >= ' ' && char <= '&' && char != '"') ||
        (char >= '*' && char <= '.') ||
        
        char == '=' ||
        char == '^' ||
        char == '_' ||
        char == '~'  ) {
      // continue...
    } else {
      return false;
    }
  }
  return true;
}


function valid_name (name) {
  // allowed: a-z A-Z .
  // username should be trimmed before sending here.

  if (!name) return false;
  if (name.length > 100) return false;

  const charList = name.split("");
  if (charList[0] == " " || charList[charList.length - 1] == " ") return false;

  for (let i = 0; i < charList.length; i++) {
    let char = charList[i];
    if ((char >= 'a' && char <= 'z') ||
        (char >= 'A' && char <= 'Z')) {
      // continue...

    } else if (char == ' ') {
      if (charList[i + 1] == " ") {
        return false;
      }
      // continue...
    } else {
      return false;
    }
  }
  return true;
}


function valid_usertype(userType) {
  if (userType == 0 || userType == 1) return true;
  return false;
}


function valid_userID (userID) {
  if (typeof(userID) == "number") return true;
  return false;
}

let port = 8000;
app.listen(port, function () {
  console.log("RentWise server running on port: " + port);
});
