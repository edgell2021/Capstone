/* Global Variables */
const geoCodeURL = "http://api.geonames.org/searchJSON?q=";
const geoCodeUserName = "&username=joedgell";

let darkSkyBase;
let latitude;
let longitude;

// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth() + 1 + "/" + d.getDate() + "/" + d.getFullYear();

document.getElementById("generate").addEventListener("click", performAction);

function performAction(e) {
  let city = document.getElementById("city").value;
  let feels = document.getElementById("feelings").value;
  let depD = document.getElementById("depDate").value;
  let date2 = new Date(depD);
  let departureDate =
    date2.getUTCMonth() +
    1 +
    "/" +
    date2.getUTCDate() +
    "/" +
    date2.getUTCFullYear();
  date2.setDate(date2.getDate() + 7);
  let weekAhead =
    date2.getUTCMonth() +
    1 +
    "/" +
    date2.getUTCDate() +
    "/" +
    date2.getUTCFullYear();

  getCityInfo(geoCodeURL, city, geoCodeUserName, feels).then(function(data) {
    postData("http://localhost:3000/city", {
      weekAhead: weekAhead,
      date: newDate,
      depDate: departureDate,
      feels: feels,
      name: data.geonames[0].name,
      countryName: data.geonames[0].countryName,
      lat: data.geonames[0].lat,
      lng: data.geonames[0].lng
    })
      .then(getDSurl())
      .then(updateUI());
  });
}

function getDSurl() {
  fetch("http://localhost:3000/weatherKey")
    .then(response => {
      return response.json();
    })
    .then(data => {
      darkSkyBase = data.urlVal;
    });
}

function coord() {
  latitude = document.getElementById("latitude").innerText + ",";
  longitude = document.getElementById("longitude").innerText;
  console.log(latitude);
}

const getCityInfo = async (geoCodeURL, city, geoCodeUserName) => {
  const res = await fetch(geoCodeURL + city + geoCodeUserName);
  try {
    const data = await res.json();
    return data;
  } catch (error) {
    console.log("error", error);
  }
};

const getWeatherInfo = async (darkSkyBase, latitude, longitude) => {
  const res = await fetch(darkSkyBase + latitude + longitude);
  try {
    const data = await res.json();
    return data;
  } catch (error) {
    console.log("error", error);
  }
};

const updateUI = async () => {
  const request = await fetch("http://localhost:3000/all");
  try {
    const allData = await request.json();
    const headers = document.getElementsByClassName("header");
    let key = allData.length - 1;
    for (let header of headers) {
      header.classList.remove("hide");
    }
    document.getElementById("latitude").innerHTML = allData[key].lat;
    document.getElementById("longitude").innerHTML = allData[key].lng;
    document.getElementById("date").innerHTML = allData[key].depDate;
    document.getElementById("locationName").innerHTML =
      allData[key].name + ", " + allData[key].countryName;
    document.getElementById("content").innerHTML = allData[key].feels;
    coord();
    getWeatherInfo(darkSkyBase, latitude, longitude).then(function(data) {
      postData("http://localhost:3000/weather", {
        timezone: data.timezone
      });
    });
  } catch (error) {
    console.log("error", error);
  }
};

//Client side Async POST
const postData = async (url = "", data = {}) => {
  console.log(data);
  const response = await fetch(url, {
    method: "POST",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data) // body data type must match "Content-Type" header
  });

  try {
    const newData = await response.json();
    console.log(newData);
    return newData;
  } catch (error) {
    console.log("error", error);
  }
};

export { performAction, getCityInfo, getWeatherInfo, postData, updateUI };
