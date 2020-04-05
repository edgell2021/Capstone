/* Global Variables */
const geoCodeURL = "http://api.geonames.org/searchJSON?q=";
const geoCodeUserName = "&username=joedgell";

let darkSkyBase;
let pixBase;
let timeToTrip;

// Create a new date instance dynamically with JS
let d = new Date();
let current = new Date().getTime();
let newDate = d.getMonth() + 1 + "/" + d.getDate() + "/" + d.getFullYear();

document.getElementById("generate").addEventListener("click", performAction);

function performAction(e) {
  let city = document.getElementById("city").value;
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
  let time = Math.floor(date2.getTime() / 1000);
  countDownTrip(depD);
  getCityInfo(geoCodeURL, city, geoCodeUserName).then(function (data) {
    postData("http://localhost:3000/city", {
      timeToTrip: timeToTrip,
      date: newDate,
      depDate: departureDate,
      time: time,
      name: data.geonames[0].name,
      countryName: data.geonames[0].countryName,
      lat: data.geonames[0].lat,
      lng: data.geonames[0].lng,
    })
      .then(getPixurl())
      .then(getDSurl())
      .then(updateUI);
  });
}

const countDownTrip = async (depD) => {
  let midnight = depD + " 23:59:59";
  let future = new Date(midnight).getTime();
  let countdown = future - current;
  let oneDay = 1000 * 60 * 60 * 24;
  timeToTrip = Math.floor(countdown / oneDay);
  return timeToTrip;
};

const getDSurl = async () => {
  const res = await fetch("http://localhost:3000/weatherKey");
  try {
    const data = await res.json();
    darkSkyBase = data.urlVal;
    getWeatherInfo(darkSkyBase).then(function (data) {
      console.log(data);
      postData("http://localhost:3000/city", {
        timezone: data.timezone,
        temp: data.currently.temperature,
        summary: data.hourly.summary,
      });
      document.getElementById("temp").innerHTML = data.currently.temperature;
      document.getElementById("summary").innerHTML = data.hourly.summary;
    });
    return data;
  } catch (error) {
    console.log("error", error);
  }
};

const getPixurl = async () => {
  const res = await fetch("http://localhost:3000/pictureKey");
  try {
    const data = await res.json();
    pixBase = data.urlVal;
    getPictureInfo(pixBase).then(function (data) {
      console.log(data);
      postData("http://localhost:3000/city", {
        picture: data.hits[0].pageURL,
      });
      var img = new Image();
      img.id = "pic";
      img.src = data.hits[0].webformatURL;
      document.getElementById("pic").replaceWith(img);
    });
    return data;
  } catch (error) {
    console.log("error", error);
  }
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

const getWeatherInfo = async (darkSkyBase) => {
  const res = await fetch(darkSkyBase);
  try {
    const data = await res.json();
    return data;
  } catch (error) {
    console.log("error", error);
  }
};

const getPictureInfo = async (pixBase) => {
  const res = await fetch(pixBase);
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
    document.getElementById("countdown").innerHTML = allData[key].timeToTrip;
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
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data), // body data type must match "Content-Type" header
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
