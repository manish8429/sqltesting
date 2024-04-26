const { faker } = require('@faker-js/faker');
const mysql = require('mysql2');
const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");

app.use(methodOverride("_method"));
app.use(express.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

const Connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'delta_app',
  password: 'manish@8429'
});


let createRandomUser = () => {
  return [
    faker.string.uuid(),
    faker.internet.userName(),
    faker.internet.email(),
    faker.internet.password(),
  ];
}

app.get("/", (req, res) => {
  let q = `SELECT count(*) FROM usr`;
  try{
Connection.query(q, (err, result) => {
  if(err) throw err;
  let count = result[0]["count(*)"];
  res.render("home.ejs", {count});
} );
} catch(err) {
  console.log(err);
  res.send("Some Error In DB");
}
});

// show route
app.get("/user", (req, res) => {
  let q = `SELECT * FROM usr`;
  try{
    Connection.query(q, (err, users) => {
      if(err) throw err;
      res.render("showuser.ejs", { users});
    } );
    } catch(err) {
      console.log(err);
      res.send("Some Error In DB");
    }
});

//Edit rought
app.get("/user/:id/edit", (req, res) => {
  let {id} = req.params;
  let q = `SELECT * FROM usr WHERE id = '${id}'`;
  try{
    Connection.query(q, (err, result) => {
      if(err) throw err;
      let user = result[0];
      res.render("edit.ejs", {user});
    } );
    } catch(err) {
      console.log(err);
      res.send("Some Error In DB");
    }
});

//update route
app.patch("/user/:id", (req, res) => {
  let {id} = req.params;
  let {password: formpass, username: newUsername} = req.body;
  let q = `SELECT * FROM usr WHERE id = '${id}'`;
  try{
    Connection.query(q, (err, result) => {
      if(err) throw err;
      let user = result[0];
      if(formpass != user.password){
        res.send("Wrong Password");
      } else {
       let q2 = `UPDATE usr SET username='${newUsername}' WHERE id = '${id}'`;
       Connection.query(q2, (err, result) => {
        if(err) throw err;
        res.send(result);
        res.redirect("/user");
       });
      }
      
    });
    } catch(err) {
      console.log(err);
      res.send("Some Error In DB");
    }
});

app.listen("8080", () => {
  console.log("Server is listening to port 8080")
});
