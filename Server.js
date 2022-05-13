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
  let doc = 0;
  let docDOM = 0;
  if (req.session.loggedIn) {

    // regular user, do:
    if (req.session.userlevel == 0) {
      doc = fs.readFileSync("./html/profile.html", "utf8");
      docDOM = new JSDOM(doc);

      const connection = await mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "COMP2800",
        multipleStatements: true
      });
      connection.connect();
      const [rows, fields] = await connection.execute(
        "SELECT username, email_address, password FROM BBY_37_user " +
        "WHERE BBY_37_user.user_id = " + req.session.userid);
      await connection.end();

      docDOM.window.document.getElementById("username").innerHTML = "Username: " + rows[0].username;
      docDOM.window.document.getElementById("email").innerHTML = "Email: " + rows[0].email_address;
      docDOM.window.document.getElementById("password").innerHTML = "Password: " + rows[0].password;
      res.send(docDOM.serialize());


      // admin user, do:
    } else if (req.session.userlevel == 1) {
      doc = fs.readFileSync("./html/admin.html", "utf8");
      docDOM = new JSDOM(doc);

      const connection = await mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "COMP2800",
        multipleStatements: true
      });
      connection.connect();
      let [rows, fields] = await connection.execute(
        "SELECT username, email_address, password FROM BBY_37_user " +
        "WHERE BBY_37_user.user_id = " + req.session.userid);

      docDOM.window.document.getElementById("username").innerHTML = "Username: " + rows[0].username;
      docDOM.window.document.getElementById("email").innerHTML = "Email: " + rows[0].email_address;
      docDOM.window.document.getElementById("password").innerHTML = "Password: " + rows[0].password;

      [rows, fields] = await connection.execute("SELECT * FROM BBY_37_user ");
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
        table += "<tr><td>" +
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
  } else {
    // not logged in - no session and no access, redirect to root.
    res.redirect("/");
  }
}


app.post("/login", function (req, res) {
  authenticateUser(req, res);
});

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

let port = process.env.PORT || 8000;
app.listen(port, function () {
  console.log("RentWise server running on port: " + port);
});