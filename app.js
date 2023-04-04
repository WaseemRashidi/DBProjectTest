
var express = require('express');
var router = express.Router();
var assert = require('assert');
var bodyParser = require('body-parser');


var mongo = require('mongodb').MongoClient;
var url = "mongodb://127.0.0.1:27017";

var app = express();
app.use(express.static(__dirname));
var PORT = 8080;


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

//Login Authentication Code
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", '*');
  res.header("Access-Control-Allow-Credentials", true);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With, Content-Type,Accept,content-type,application/json');
  next();
});


//home page//
app.get('/', function(req, res){
  console.log(__dirname);
  res.sendFile(__dirname + '/index.html');
});

//Open register page//
app.get('/Register', function(req, res){
  console.log(__dirname);
  res.sendFile(__dirname + '/Register.html');
});

//login page//
app.get('/login', function(req, res){
  console.log(__dirname);
  res.sendFile(__dirname + '/login.html');
});

//payment page//
app.get('/payment', function(req, res){
  console.log(__dirname);
  res.sendFile(__dirname + '/payment.html');
});



//register page//
app.post('/Register', function(req, res){
  console.log(req.body);
  var customer1 = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password
  };

  mongo.connect(url, function(err, db) {
    if (err) throw err;
    dbo = db.db("DBProject");
    dbo.collection("customers").insertOne(customer1, function(err, db){
      console.log(req.body);
      if(err) {
        console.log(err);
        return res.status(500).send();
        console.log("An error has occurred");
      }
    });
  });
});



//login page//
app.post('/login', function(req, res){
  var email = req.body.email;
  var password = req.body.password;
  mongo.connect(url, function(err, db) {
    if (err) throw err;
    dbo = db.db("DBProject");
    dbo.collection("customers").findOne({email: email, password: password}, function(err, db){
      if(err) {
        console.log(err);
        return res.status(500).send();
        console.log("An error has occurred");
      }else if(!db) {
        return res.status(404).send();
        console.log("Invalid username or password, please try again.");
      }else {
        return res.status(200).send();
        console.log("Login Successful!");
        res.sendFile(__dirname + '/index.html');
      }
    });
  });
});


//payment page//
app.post('/payment', function(req, res){
  console.log(req.body);
  var orderdetails = {
    fullname: req.body.fullname,
    email: req.body.email,
    city: req.body.city,
    state: req.body.state,
    zip: req.body.zip,
    cardname: req.body.cname,
    cardnumber: req.body.ccnumber,
    expmonth: req.body.expmonth,
    expyear: req.body.expyear,
    cvv: req.body.cvv
  };

  mongo.connect(url, function(err, db) {
    if (err) throw err;
    dbo = db.db("DBProject");
    dbo.collection("Orders").insertOne(orderdetails, function(err, db){
      console.log(req.body);
      if(err) {
        console.log(err);
        return res.status(500).send();
        console.log("An error has occurred");
      }
    });
  });
});


module.exports = app;

app.listen(PORT, function(err){
  if (err) console.log(err);
  console.log("Server listening on PORT", PORT);
});
