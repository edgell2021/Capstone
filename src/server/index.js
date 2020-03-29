// Setup empty JS object to act as endpoint for all routes
projectData = {};

const dotenv = require("dotenv");
dotenv.config();

// Require Express to run server and routes
const express = require("express");

// Start up an instance of app
const app = express();

/* Middleware*/
//Here we are configuring express to use body-parser as middle-ware.
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance
const cors = require("cors");
app.use(cors());

// Initialize the main project folder
app.use(express.static("dist"));

// Setup Server
const port = 3000;
const server = app.listen(port, listening);

function listening() {
  console.log("server started");
  console.log(`server number: ${port}`);
}

//GET route
app.get("/", function(req, res) {
  res.send(projectData);
});

// POST route
data = [];

app.post("/city", addData);
function addData(req, res) {
  let newData = req.body;
  newEntry = {
    weekAhead: newData.weekAhead,
    depDate: newData.depDate,
    date: newData.date,
    feels: newData.feels,
    name: newData.name,
    countryName: newData.countryName,
    lat: newData.lat,
    lng: newData.lng
  };
  data.push(newEntry);
  res.send(data);
  console.log(data);
}

const dark_key = process.env.DARK_API_KEY + "/";
const dark_URL = "https://api.darksky.net/forecast/";

app.get("/weatherKey", function(req, res) {
  const url = dark_URL + dark_key;
  console.log(url);
  res.send(url);
});

// app.post("/weather", addData);
// function addData(req, res) {
//   let newData = req.body;
//   newEntry = {
//     timezone: newData.timezone
//   };
//   data.push(newEntry);
//   res.send(data);
//   // console.log(data);
// }

//GET request
app.get("/all", function(req, res) {
  res.send(data);
});
