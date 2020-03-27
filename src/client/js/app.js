/* Global Variables */
const baseURL = "http://api.openweathermap.org/data/2.5/weather?zip=";
const apiKey = "&APPID=a17ba8685d517879eb7f8157b36760f6";
const units = "&units=imperial";

// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth() + 1 + "/" + d.getDate() + "/" + d.getFullYear();

document.getElementById("generate").addEventListener("click", performAction);

function performAction(e) {
  const newZip = document.getElementById("zip").value;
  const feels = document.getElementById("feelings").value;
  getWeatherInfo(baseURL, newZip, units, apiKey, feels).then(function(data) {
    postData("/weather", {
      date: newDate,
      feels: feels,
      temp: data.main.temp
    }).then(updateUI());
  });
}

const getWeatherInfo = async (baseURL, zip, units, key) => {
  const res = await fetch(baseURL + zip + units + key);
  try {
    const data = await res.json();
    return data;
  } catch (error) {
    console.log("error", error);
    // appropriately handle the error
  }
};

const updateUI = async () => {
  const request = await fetch("/all");
  try {
    const allData = await request.json();
    const headers = document.getElementsByClassName("header");
    let key = allData.length - 1;
    for (let header of headers) {
      header.classList.remove("hide");
    }
    document.getElementById("date").innerHTML = allData[key].date;
    document.getElementById("temp").innerHTML = allData[key].temp + "&#8457;";
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
    return newData;
  } catch (error) {
    console.log("error", error);
  }
};
