let searchForm = document.querySelector("#searchForm");
let searchTextElement = document.querySelector("#txtSearch");
let searchResultsElement = document.querySelector("#searchResults");
let previousSearchesElement = document.querySelector("#previousSearches");
let btnClearSearchHistory = document.querySelector("#btnClearSearchHistory");

let previousSearches = [];

async function searchOpenWeatherAPI(searchText) {
  // Get lat & lon for a city name
  let coordinates = await fetchCoodinates(searchText);
  // await tells the function that it has to wait for the asynchronous fetch data to return before continuing
  let searchResults = await fetchWeatherData(coordinates);

  displayWeatherData(searchText, searchResults);
}

async function fetchCoodinates(cityName) {
  let apiKey = "a6aa5759087530633423e81ce8de3612";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`;

  const repsponse = await fetch(apiUrl);
  const data = await repsponse.json();

  return [data.coord.lat, data.coord.lon];
}

async function fetchWeatherData(coordinates) {
  //https://api.openweathermap.org/data/2.5/onecall?lat=33.44&lon=-94.04&exclude=minutely,hourly,alerts&appid=a6aa5759087530633423e81ce8de3612
  let apiKey = "a6aa5759087530633423e81ce8de3612";
  let lat = coordinates[0];
  let lon = coordinates[1];
  let lang = "en";
  let units = "imperial";
  let exclude = "minutely,hourly,alerts";
  let apiUrl = `http://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${units}&lang=${lang}&exclude=${exclude}`;

  const repsponse = await fetch(apiUrl);
  const data = await repsponse.json();

  return data;
}

function displayWeatherData(searchText, searchResults) {
  removeAllChildNodes(searchResultsElement);

  // Current weather
  //let currentDate = new Date(searchResults.current.dt * 1000); //timestamp * 1000
  let currentDate = moment.unix(searchResults.current.dt).format("M/D/YYYY");
  let currentWeatherIcon = searchResults.current.weather[0].icon;
  let currentWeatherDesc = searchResults.current.weather[0].description;
  let currentTemp = searchResults.current.temp;
  let currentWind = searchResults.current.wind_speed;
  let currentHumidity = searchResults.current.humidity;
  let currentUVI = searchResults.current.uvi;

  const dvCurrentWeatherData = document.createElement("div");
  dvCurrentWeatherData.classList.add("row");
  dvCurrentWeatherData.classList.add("border");
  dvCurrentWeatherData.classList.add("border-dark");

  const h3Title = document.createElement("h3");
  h3Title.textContent = `${searchText} ${currentDate}`;
  dvCurrentWeatherData.append(h3Title);

  const imgCurrentWeather = document.createElement("img");
  imgCurrentWeather.classList.add("card-img-top");
  imgCurrentWeather.src = `http://openweathermap.org/img/wn/${currentWeatherIcon}@2x.png`;
  imgCurrentWeather.alt = `${currentWeatherDesc}`;
  dvCurrentWeatherData.append(imgCurrentWeather);

  const pTemp = document.createElement("p");
  pTemp.textContent = `Temp: ${currentTemp} \xB0F`;
  dvCurrentWeatherData.append(pTemp);

  const pWind = document.createElement("p");
  pWind.textContent = `Wind: ${currentWind} MPH`;
  dvCurrentWeatherData.append(pWind);

  const pHumidity = document.createElement("p");
  pHumidity.textContent = `Humidity: ${currentHumidity}%`;
  dvCurrentWeatherData.append(pHumidity);

  const pUVI = document.createElement("p");
  pUVI.textContent = "UV Index: ";
  const sUVI = document.createElement("span");
  sUVI.classList.add("badge");
  sUVI.classList.add(getUVBadgeClass(currentUVI));
  sUVI.textContent = `${currentUVI}`;
  pUVI.append(sUVI);
  dvCurrentWeatherData.append(pUVI);

  searchResultsElement.append(dvCurrentWeatherData);

  // 5-Day Forecast Title
  const dv5DayForecastTitle = document.createElement("div");
  dv5DayForecastTitle.classList.add("row");
  dv5DayForecastTitle.classList.add("mt-2");
  const h4Title = document.createElement("h4");
  h4Title.textContent = `5-Day Forecast:`;
  dv5DayForecastTitle.append(h4Title);

  searchResultsElement.append(dv5DayForecastTitle);

  // Daily Weather
  const dvDailyWeatherData = document.createElement("div");
  dvDailyWeatherData.classList.add("row");
  dvDailyWeatherData.classList.add("d-flex");
  dvDailyWeatherData.classList.add("justify-content-center");
  dvDailyWeatherData.classList.add("align-items-center");

  let dailyWeather = searchResults.daily;
  for (let i = 1; i < 6; i++) {
    let dailyDate = moment.unix(dailyWeather[i].dt).format("M/D/YYYY");
    let dailyWeatherIcon = dailyWeather[i].weather[0].icon;
    let dailyWeatherDesc = dailyWeather[i].weather[0].description;
    let dailyTemp = dailyWeather[i].temp.day;
    let dailyWind = dailyWeather[i].wind_speed;
    let dailyHumidity = dailyWeather[i].humidity;
    let dailyUVI = dailyWeather[i].uvi;

    const dvCard = document.createElement("div");
    dvCard.classList.add("card");
    dvCard.classList.add("col-12");
    dvCard.classList.add("col-md-4");
    dvCard.classList.add("col-lg-3");
    dvCard.classList.add("bg-dark");
    dvCard.classList.add("text-light");
    dvCard.classList.add("m-1");

    const h5Title = document.createElement("h5");
    h5Title.classList.add("card-title");
    h5Title.classList.add("p-2");
    h5Title.textContent = `${dailyDate}`;
    dvCard.append(h5Title);

    const imgDailyWeather = document.createElement("img");
    imgDailyWeather.classList.add("card-img-top");
    imgDailyWeather.src = `http://openweathermap.org/img/wn/${dailyWeatherIcon}@2x.png`;
    imgDailyWeather.alt = `${dailyWeatherDesc}`;
    dvCard.append(imgDailyWeather);

    const dvCardBody = document.createElement("div");
    dvCardBody.classList.add("card-body");

    const pDailyTemp = document.createElement("p");
    pDailyTemp.classList.add("card-text");
    pDailyTemp.textContent = `Temp: ${dailyTemp} \xB0F`;
    dvCardBody.append(pDailyTemp);

    const pDailyWind = document.createElement("p");
    pDailyWind.classList.add("card-text");
    pDailyWind.textContent = `Wind: ${dailyWind} MPH`;
    dvCardBody.append(pDailyWind);

    const pDailyHumidity = document.createElement("p");
    pDailyHumidity.classList.add("card-text");
    pDailyHumidity.textContent = `Humidity: ${dailyHumidity}%`;
    dvCardBody.append(pDailyHumidity);

    const pDailyUVI = document.createElement("p");
    pDailyUVI.classList.add("card-text");
    pDailyUVI.textContent = "UV Index: ";
    const sDailyUVI = document.createElement("span");
    sDailyUVI.classList.add("badge");
    sDailyUVI.classList.add(getUVBadgeClass(dailyUVI));
    sDailyUVI.textContent = `${dailyUVI}`;
    pDailyUVI.append(sDailyUVI);
    dvCardBody.append(pDailyUVI);

    dvCard.append(dvCardBody);
    dvDailyWeatherData.append(dvCard);
  }

  searchResultsElement.append(dvDailyWeatherData);
}

function getUVBadgeClass(uvi) {
  let uviClass = "";
  if (uvi <= 3) {
    uviClass = "text-bg-low";
  } else if (uvi > 3 && uvi <= 6) {
    uviClass = "text-bg-moderate";
  } else if (uvi > 6 && uvi <= 8) {
    uviClass = "text-bg-high";
  } else if (uvi > 8 && uvi <= 11) {
    uviClass = "text-bg-very-high";
  } else {
    uviClass = "text-bg-extreme";
  }
  return uviClass;
}

function search(event) {
  event.preventDefault();

  let searchText = toTitleCase(searchTextElement.value.trim());

  if (searchText) {
    // Search Open Weather API for provided city name
    searchOpenWeatherAPI(searchText);

    // Save Search Text to Local Storage
    saveSearch(searchText);

    // Update Button list of Previous Searches
    displayPreviousSearches();

    // Clear the Search textbox
    searchTextElement.value = "";
  } else {
    alert("Please enter a search parameter.");
  }
}
searchForm.addEventListener("submit", search);

function removeAllChildNodes(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

//https://stackoverflow.com/questions/4878756/how-to-capitalize-first-letter-of-each-word-like-a-2-word-city
function toTitleCase(str) {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

function saveSearch(searchText) {
  // If it's already in the array, remove it so that we can add it again at the top
  if (previousSearches.includes(searchText)) {
    previousSearches.splice(previousSearches.indexOf(searchText), 1);
  }
  previousSearches.unshift(searchText);
  localStorage.setItem("previousSearches", JSON.stringify(previousSearches));
}

function clearSearchHistory(event) {
  event.preventDefault();

  localStorage.removeItem("previousSearches");
  previousSearches = [];

  displayPreviousSearches();
}
btnClearSearchHistory.addEventListener("click", clearSearchHistory);

function displayPreviousSearches() {
  removeAllChildNodes(previousSearchesElement);

  if (localStorage.getItem("previousSearches") != null) {
    previousSearches = JSON.parse(localStorage.getItem("previousSearches"));

    // Loop through previous searches & build a button for each.
    for (let i = 0; i < previousSearches.length; i++) {
      const btnPreviousSearch = document.createElement("button");
      btnPreviousSearch.classList.add("btn");
      btnPreviousSearch.classList.add("btn-block");
      btnPreviousSearch.classList.add("btn-secondary");
      btnPreviousSearch.classList.add("my-1");
      btnPreviousSearch.classList.add("w-100");
      btnPreviousSearch.classList.add("previousSearch");
      btnPreviousSearch.textContent = previousSearches[i];
      previousSearchesElement.append(btnPreviousSearch);
    }

    // Show Clear Search History Button
    btnClearSearchHistory.classList.remove("invisible");
    btnClearSearchHistory.classList.add("visible");
  } else {
    //Hide Clear Search History Button
    btnClearSearchHistory.classList.remove("visible");
    btnClearSearchHistory.classList.add("invisible");
  }
}

previousSearchesElement.addEventListener("click", function (event) {
  if (event.target.classList.contains("previousSearch")) {
    let searchText = event.target.textContent;
    searchOpenWeatherAPI(searchText);
  }
});

function init() {
  displayPreviousSearches();
}
init();
