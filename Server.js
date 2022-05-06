"use strict";

// REQUIRES
const express = require("express");
const session = require("express-session");
const app = express();
const fs = require("fs");
const mysql = require("mysql2/promise");


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
    let doc = fs.readFileSync("./html/login.html", "utf8");
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
  let doc = 0;
  if (req.session.loggedIn) {
    if (req.session.userlevel == 0) {
      doc = fs.readFileSync("./html/profile.html", "utf8");
      res.send(doc);  
    } else if (req.session.userlevel == 1) {
      doc = fs.readFileSync("./html/admin.html", "utf8");
      res.send(doc);  
    }
  } else {
    // not logged in - no session and no access, redirect to root.
    res.redirect("/");
  }
});


app.post("/login", function (req, res) {
  res.setHeader("Content-Type", "application/json");
  // console.log("What was sent", req.body.email, req.body.password);

  //check with server
  authenticateUser(req, res);
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



let port = 8000;
app.listen(port, function () {
  console.log("Server running on port: " + port);
});