// Setup empty JS object to act as endpoint for all routes
projectData = {};

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

console.log(__dirname);

app.get("/", function(req, res) {
  res.sendFile("./dist/index.html");
});

// designates what port the app will listen to for incoming requests
app.listen(8081, function() {
  console.log("Example app listening on port 8081!");
});

app.get("/test", function(req, res) {
  console.log(mockAPIResponse);
  res.send(mockAPIResponse);
});

//GET route
app.get("/", function(req, res) {
  res.send(projectData);
});

// POST route
data = [];

app.post("/weather", addData);

function addData(req, res) {
  let newData = req.body;
  console.log(newData);
  newEntry = {
    date: newData.date,
    temp: newData.temp,
    feels: newData.feels
  };
  data.push(newEntry);
  res.send(data);
  console.log(data);
}

//GET request
app.get("/all", function(req, res) {
  res.send(data);
  console.log(data);
});
