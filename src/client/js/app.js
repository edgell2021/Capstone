/* Global Variables */
const geoCodeURL = "http://api.geonames.org/searchJSON?q=";
const geoCodeUserName = "&username=joedgell";

// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth() + 1 + "/" + d.getDate() + "/" + d.getFullYear();

document.getElementById("generate").addEventListener("click", performAction);

function checkDate(e) {
  var date = new Date();
  date.setDate(date.getDate() + 7);
  let day7 = d.getMonth() + 1 + "/" + d.getDate() + "/" + d.getFullYear();
  console.log(day7);
}

function performAction(e) {
  const city = document.getElementById("city").value;
  const feels = document.getElementById("feelings").value;
  const depD = document.getElementById("depDate").value;
  let date2 = new Date(depD);
  let departureDate =
    date2.getMonth() + 1 + "/" + date2.getDate() + "/" + date2.getFullYear();
  checkDate();
  getCityInfo(geoCodeURL, city, geoCodeUserName, feels).then(function(data) {
    console.log(data);
    postData("http://localhost:3000/city", {
      date: newDate,
      depDate: departureDate,
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
    const headers = document.getElementsByClassName("header");
    let key = allData.length - 1;
    for (let header of headers) {
      header.classList.remove("hide");
    }
    document.getElementById("date").innerHTML = allData[key].depDate;
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

export { performAction, getCityInfo, postData, updateUI, checkDate };
