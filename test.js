function updateResponseText(testNumber, message) {
  const responseTextElement = document.querySelector(`.testContainer${testNumber} .responseText`);
  responseTextElement.innerHTML = message;
}

function testGetCities() {
  fetch("/cities")
    .then(response => {
      if (response.status === 200) return response.json();
      throw new Error();
    })
    .then(data => {
      if (data) {
        updateResponseText(1, "The test ran successfully!");
      } else {
        throw new Error();
      }
    })
    .catch(() => updateResponseText(1, "The test failed."));
}

function testPostCity() {
  fetch("/cities", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: "Malmö", country: "Sweden" })
  })
    .then(response => {
      if (response.status === 200) return response.json();
      throw new Error();
    })
    .then(data => {
      const ok = data.id && data.name === "Malmö" && data.country === "Sweden";
      if (ok) {
        updateResponseText(2, "The test ran successfully!");
      } else {
        throw new Error();
      }
    })
    .catch(() => updateResponseText(2, "The test failed."));
}

function testDeleteCity() {
  fetch('/cities', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: 2 })
  })
    .then(response => {
      if (response.status === 200) return response.json();
      throw new Error();
    })
    .then(data => {
      updateResponseText(3, "The test ran successfully!");
    })
    .catch(() => updateResponseText(3, "The test failed."));
}

function testGetCitiesAfterChanges() {
  fetch('/cities')
    .then(response => {
      if (response.status === 200) return response.json();
      throw new Error();
    })
    .then(data => {
      if (data.some(city => city.name === "Malmö")) {
        updateResponseText(4, "The test ran successfully!");
      } else {
        throw new Error();
      }
    })
    .catch(() => updateResponseText(4, "The test failed."));
}

function testGetCityById() {
  fetch('/cities/43')
    .then(response => {
      if (response.status === 200) return response.json();
      throw new Error();
    })
    .then(data => {
      const ok = data.id === 43 && data.name === "Malmö" && data.country === "Sweden";
      updateResponseText(5, "The test ran successfully!");
    })
    .catch(() => updateResponseText(5, "The test failed."));
}

function testSearchCitiesByText() {
  fetch('/cities/search?city=en')
    .then(response => {
      if (response.status === 200) return response.json();
      throw new Error();
    }).then(responseObj => {
      const searchHitsArray = [];
      for (let currResponsObj of responseObj) {
        searchHitsArray.push(currResponsObj);
      };
      updateResponseText(6, "The test was successful!");
      console.log(responseObj)
    })
    .catch(() => updateResponseText(6, "The test failed."));
}

function testSearchCitiesByTextAndCountry() {
  fetch('/cities/search?city=en&country=Sweden')
    .then(response => {
      if (response.status === 200) return response.json();
      throw new Error();
    })
    .then(() => {
      updateResponseText(7, "The test ran successfully!");
    })
    .catch(() => updateResponseText(7, "The test failed."));
}

function testInvalidRequest() {
  const methodInput = document.querySelector('.testContainer8 .methodText')?.value;
  const endpointInput = document.querySelector('.testContainer8 .endpointText')?.value;
  const requestBodyInput = document.querySelector('.testContainer8 .requestBodyText')?.value;

  if (!methodInput || !endpointInput) {
    updateResponseText(8, "Please enter a method (GET, POST, DELETE) and endpoint.");
  }

  if (methodInput && endpointInput) {

    if (requestBodyInput) {
      const requestObj = new Request(endpointInput, {
        method: methodInput,
        headers: { "Content-Type": "application/json" },
        body: requestBodyInput
      })

      fetch(requestObj)
        .then(response => {
          if (response.status == 400) {
            updateResponseText(8, "The test ran successfully!");
          } else {
            throw new Error();
          }
        })
        .catch(() => updateResponseText(8, "The test failed."));
    }

    if (!requestBodyInput) {
      const requestObj = new Request(endpointInput, {
        method: methodInput,
        headers: { "Content-Type": "application/json" }
      })

      fetch(requestObj)
        .then(response => {
          if (response.status == 400) {
            updateResponseText(8, "The test ran successfully!");
          } else {
            throw new Error();
          }
        })
        .catch(() => updateResponseText(8, "The test failed."));
    }
  }
}

function testInvalidPostRequest() {
  const requestObj = new Request("http://localhost:8000/cities", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: "Dresden", country: "Germany" })
  })

  fetch(requestObj)
    .then(response => {
      if (response.status == 409) {
        updateResponseText(9, "The test ran successfully!");
        return [];
      } else {
        throw new Error();
      }
    })
    .catch(() => updateResponseText(9, "The test failed."));
}

function testInvalidDeleteRequest() {
  const requestObj = new Request("http://localhost:8000/cities", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: 56 })
  })

  fetch(requestObj)
    .then(response => {
      if (response.status == 404) {
        updateResponseText(10, "The test ran successfully!");
      } else {
        throw new Error();
      }
    })
    .catch(() => updateResponseText(10, "The test failed."));
}

document.querySelector('.testContainer1 .btnTest').addEventListener('click', testGetCities);
document.querySelector('.testContainer2 .btnTest').addEventListener('click', testPostCity);
document.querySelector('.testContainer3 .btnTest').addEventListener('click', testDeleteCity);
document.querySelector('.testContainer4 .btnTest').addEventListener('click', testGetCitiesAfterChanges);
document.querySelector('.testContainer5 .btnTest').addEventListener('click', testGetCityById);
document.querySelector('.testContainer6 .btnTest').addEventListener('click', testSearchCitiesByText);
document.querySelector('.testContainer7 .btnTest').addEventListener('click', testSearchCitiesByTextAndCountry);
document.querySelector('.testContainer8 .btnTest').addEventListener('click', testInvalidRequest);
document.querySelector('.testContainer9 .btnTest').addEventListener('click', testInvalidPostRequest);
document.querySelector('.testContainer10 .btnTest').addEventListener('click', testInvalidDeleteRequest);
