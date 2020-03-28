function handleSubmit(event) {
  event.preventDefault();

  // check what text was put into the form field
  const baseURL = "http://localhost:8081/sentiment";
  let urlVal = document.getElementById("name").value;
  const data = { url: urlVal };
  Client.checkForName(urlVal);

  console.log("::: Form Submitted :::");
  // fetch('http://localhost:8080/test')
  // .then(res => res.json())
  // .then(function(res) {
  //     document.getElementById('results').innerHTML = res.message
  // })

  fetch(baseURL, {
    method: "POST",
    credentials: "same-origin",
    mode: "cors",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })
    .then(res => res.json())
    .then(function(res) {
      console.log(res);
      document.getElementById("reviewText").innerHTML = res.text;
      document.getElementById("polarity").innerHTML = res.polarity;
      document.getElementById("subjectivity").innerHTML = res.subjectivity;
      document.getElementById("polarity-conf").innerHTML =
        res.polarity_confidence;
      document.getElementById("subjectivity-conf").innerHTML =
        res.subjectivity_confidence;
    });
}

export { handleSubmit };
