/* Global Variables */
const geoCodeURL = "http://api.geonames.org/searchJSON?q=";
const geoCodeUserName = "&username=joedgell";

let darkSkyBase;
let pixBase;
let timeToTrip;
let tripLength;

// Create a new date instance dynamically with JS
const error = document.querySelector(".error-msg");
let d = new Date();
let current = new Date().getTime();
let newDate = d.getMonth() + 1 + "/" + d.getDate() + "/" + d.getFullYear();
let oneDay = 1000 * 60 * 60 * 24;

document.getElementById("generate").addEventListener("click", validateInput);

function validateInput(e) {
  let city = document.getElementById("city").value;
  let depD = document.getElementById("depDate").value;
  let returnD = document.getElementById("returnDate").value;

  if (city == "" || depD == "" || returnD == "") {
    showMsg();
  } else {
    hideMsg();
    performAction(city, depD, returnD);
  }
}

const hideMsg = () => {
  error.classList.remove("show");
  error.classList.add("hide");
};

const showMsg = () => {
  error.classList.remove("hide");
  error.classList.add("show");
};
const performAction = (city, depD, returnD) => {
  let date2 = new Date(depD);
  let departureDate =
    date2.getUTCMonth() +
    1 +
    "/" +
    date2.getUTCDate() +
    "/" +
    date2.getUTCFullYear();
  let midnight = depD + " 23:59:59";
  let returnDate = new Date(returnD);
  let returnInfo =
    returnDate.getUTCMonth() +
    1 +
    "/" +
    returnDate.getUTCDate() +
    "/" +
    returnDate.getUTCFullYear();
  let time = Math.floor(date2.getTime() / 1000);

  countDownTrip(midnight);
  tripTime(midnight, returnD);
  getCityInfo(geoCodeURL, city, geoCodeUserName).then(function (data) {
    postData("http://localhost:3000/city", {
      timeToTrip: timeToTrip,
      tripLength: tripLength,
      returnInfo: returnInfo,
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
      .then(updateUI)
      .then(clearInput());
  });
};

const clearInput = async () => {
  document.getElementById("city").value = "";
  document.getElementById("depDate").value = "";
  document.getElementById("returnDate").value = "";
};

const countDownTrip = async (midnight) => {
  let future = new Date(midnight).getTime();
  let countdown = future - current;
  timeToTrip = Math.floor(countdown / oneDay);
  return timeToTrip;
};

const tripTime = async (midnight, returnD) => {
  let depart = new Date(midnight).getTime();
  let dateR = new Date(returnD + " 23:59:59").getTime();
  let countdown = dateR - depart;
  tripLength = Math.floor(countdown / oneDay);
  return tripLength;
};

const getDSurl = async () => {
  const res = await fetch("http://localhost:3000/weatherKey");
  try {
    const data = await res.json();
    darkSkyBase = data.urlVal;
    getWeatherInfo(darkSkyBase).then(function (data) {
      postData("http://localhost:3000/city", {
        timezone: data.timezone,
        temp: data.currently.temperature,
        summary: data.hourly.summary,
      });
      let summaryInfo = document.getElementById("summary");
      document.getElementById("temp").innerHTML = data.currently.temperature;
      summaryInfo.innerHTML = data.hourly.summary;
      if (summaryInfo.innerHTML != undefined) {
        document.querySelector(".summary-info").classList.remove("hide");
      }
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
      document.querySelector(".info-container").classList.remove("hide");
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
    const headers = document.getElementsByClassName("header");
    let key = allData.length - 1;
    for (let header of headers) {
      header.classList.remove("hide");
    }
    document.getElementById("date").innerHTML = allData[key].depDate;
    document.getElementById("locationName").innerHTML =
      allData[key].name + ", " + allData[key].countryName;
    document.getElementById("returnData").innerHTML = allData[key].returnInfo;
    document.getElementById("countdown").innerHTML = allData[key].timeToTrip;
    document.getElementById("returnInfo").innerHTML = allData[key].tripLength;
  } catch (error) {
    console.log("error", error);
  }
};

//Client side Async POST
const postData = async (url = "", data = {}) => {
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
    return newData;
  } catch (error) {
    console.log("error", error);
  }
};

export { performAction, validateInput };
