"use strict";

// REQUIRES
const express = require("express");
const session = require("express-session");
const app = express();
const fs = require("fs");
const mysql = require("mysql2/promise");
const { JSDOM } = require('jsdom');


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
    res.send(doc);
  }
});

app.get("/login", function (req, res) {
  if (req.session.loggedIn) {
    res.redirect("/profile");
  } else {
    let doc = fs.readFileSync("./html/login.html", "utf8");
    res.send(doc);
  }
});

app.get("/createAccount", function (req, res) {
  if (req.session.loggedIn) {
    res.redirect("/profile");
  } else {
    let doc = fs.readFileSync("./html/createAccount.html", "utf8");
    res.send(doc);
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

    docDOM.window.document.getElementById("firstName").setAttribute("placeholder", rows[0].first_name);
    docDOM.window.document.getElementById("lastName").setAttribute("placeholder", rows[0].last_name);
    docDOM.window.document.getElementById("username").setAttribute("placeholder", rows[0].username);
    docDOM.window.document.getElementById("password").setAttribute("placeholder", rows[0].password);
    docDOM.window.document.getElementById("email").setAttribute("placeholder", rows[0].email_address);

    res.send(docDOM.serialize());
  } else {
    // not logged in - no session and no access, redirect to root.
    res.redirect("/");
  }
}


app.post("/login", function (req, res) {
  authenticateUser(req, res);
});


app.get("/admin", function (req, res) {
  if (req.session.loggedIn && req.session.userlevel == 1) {
    sendAdminPage(req, res);
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
  res.send(docDOM.serialize());
}


app.post("/signup", function (req, res) {
  res.setHeader("Content-Type", "application/json");
  createUser(req, res);
});


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
  if (rows.length == 1 ) {
      // user authenticated, create a session
      req.session.loggedIn = true;
      req.session.userlevel = rows[0].role_id;
      req.session.userid = rows[0].user_id;
      req.session.save(function (err) {
      });
      res.send({ status: "success", msg: "Logged in." });
  } else {
      res.send({ status: "fail", msg: "User account not found." });
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
  connection.query('INSERT INTO BBY_37_user (username,password,first_name,last_name,email_address,role_id) values (?, ?, ?, ?, ?, ?)',
    [req.body.username, req.body.password, req.body.firstName, req.body.lastName, req.body.email, req.body.role_id]);
  connection.end();
  res.send({
    status: "success",
    msg: "Account added."
  });
}


app.post("/delete_user", function (req, res) {
  if (req.session.loggedIn && req.session.userlevel == 1) {
    deleteUser(req, res);
  } else {
    res.send({ status: "fail", msg: "You don't have admin rights." });
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
      res.send({ status: "fail", msg: "Last admin account. Cannot remove admin." });
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
  res.send({ status: "success", msg: "Account deleted." });
}


app.post("/update_user_data", function (req, res) {
  if (req.session.loggedIn && req.session.userlevel == 1) {
    adminUpdateUsers(req, res);
  } else {
    res.send({ status: "fail", msg: "You don't have admin rights." });
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
        res.send({ status: "fail", msg: "Last admin account. Cannot remove admin privilege." });
      } else {
        doUpdateUser(req, res);
      }
    }
  } else {
      res.send({ status: "fail", msg: "User ID doesn't exist or has duplicates." });
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
  connection.query('UPDATE BBY_37_user ' +
  'SET username = ?, first_name = ?, last_name = ?, email_address = ?, password = ?, role_id = ? ' +
  'WHERE BBY_37_user.user_id = ?',
  [req.body.username, req.body.firstname, req.body.lastname, req.body.email,
      req.body.password, req.body.usertype, req.body.userID]);
  await connection.end();
  res.send({ status: "success", msg: "User data updated." });
}




let port = 8000;
app.listen(port, function () {
  console.log("RentWise server running on port: " + port);
});