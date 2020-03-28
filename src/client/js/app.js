/* Global Variables */
const geoCodeURL = "http://api.geonames.org/searchJSON?q=";
const geoCodeUserName = "&username=joedgell";
const apiKey = "&APPID=a17ba8685d517879eb7f8157b36760f6";
const units = "&units=imperial";

// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth() + 1 + "/" + d.getDate() + "/" + d.getFullYear();

document.getElementById("generate").addEventListener("click", performAction);

function performAction(e) {
  const city = document.getElementById("city").value;
  const feels = document.getElementById("feelings").value;
  getCityInfo(geoCodeURL, city, geoCodeUserName, feels).then(function(data) {
    console.log(data);
    postData("http://localhost:3000/city", {
      date: newDate,
      feels: feels,
      name: data.geonames[0].name,
      countryName: data.geonames[0].countryName,
      lat: data.geonames[0].lat,
      lng: data.geonames[0].lng
    }).then(updateUI());
  });
}

const getCityInfo = async (geoCodeURL, city, geoCodeUserName) => {
  const res = await fetch(geoCodeURL + city + geoCodeUserName);
  try {
    const data = await res.json();
    return data;
  } catch (error) {
    console.log("error", error);
    // appropriately handle the error
  }
};

const updateUI = async () => {
  const request = await fetch("http://localhost:3000/all");
  try {
    const allData = await request.json();
    console.log(allData[0]);
    const headers = document.getElementsByClassName("header");
    let key = allData.length - 1;
    for (let header of headers) {
      header.classList.remove("hide");
    }
    document.getElementById("date").innerHTML = allData[key].date;
    document.getElementById("locationName").innerHTML =
      allData[key].name + ", " + allData[key].countryName;
    document.getElementById("content").innerHTML = allData[key].feels;
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

export { performAction, getCityInfo, postData, updateUI };
