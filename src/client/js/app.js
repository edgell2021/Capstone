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
  let time = Math.floor(date2.getTime() / 1000);
  getCityInfo(geoCodeURL, city, geoCodeUserName, feels).then(function(data) {
    postData("http://localhost:3000/city", {
      weekAhead: weekAhead,
      date: newDate,
      depDate: departureDate,
      time: time,
      feels: feels,
      name: data.geonames[0].name,
      countryName: data.geonames[0].countryName,
      lat: data.geonames[0].lat,
      lng: data.geonames[0].lng
    }).then(getDSurl());
    // .then(updateUI());
    setTimeout(() => {
      getWeatherInfo(darkSkyBase)
        .then(function(data) {
          console.log(data);
          postData("http://localhost:3000/city", {
            timezone: data.timezone,
            temp: data.currently.temperature,
            feelsLike: data.currently.apparentTemperature,
            summary: data.hourly.summary
          });
        })
        .then(updateUI());
    }, 800);
  });
}

const getDSurl = () => {
  fetch("http://localhost:3000/weatherKey")
    .then(response => {
      return response.json();
    })
    .then(data => {
      darkSkyBase = data.urlVal;
    });
};

const getCityInfo = async (geoCodeURL, city, geoCodeUserName) => {
  const res = await fetch(geoCodeURL + city + geoCodeUserName);
  try {
    const data = await res.json();
    return data;
  } catch (error) {
    console.log("error", error);
  }
};

const getWeatherInfo = async darkSkyBase => {
  const res = await fetch(darkSkyBase);
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
    console.log(allData);
    const headers = document.getElementsByClassName("header");
    let key = allData.length - 1;
    for (let header of headers) {
      header.classList.remove("hide");
    }
    document.getElementById("date").innerHTML = allData[key].depDate;
    document.getElementById("locationName").innerHTML =
      allData[key].name + ", " + allData[key].countryName;
    document.getElementById("content").innerHTML = allData[key].feels;
    document.getElementById("temp").innerHTML = allData[key].temp;
    document.getElementById("feelsLike").innerHTML = allData[key].feelsLike;
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
    // console.log(newData);
    return newData;
  } catch (error) {
    console.log("error", error);
  }
};

export { performAction, getCityInfo, getWeatherInfo, postData, updateUI };
