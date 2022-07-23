let searchForm = document.querySelector("#searchForm");
let searchTextElement = document.querySelector("#txtSearch");
let searchResultsElement = document.querySelector("#searchResults");
let previousSearchesElement = document.querySelector("#previousSearches");
let btnClearSearchHistory = document.querySelector("#btnClearSearchHistory");

let previousSearches = [];

function searchOpenWeatherAPI(searchText) {
  // let apiUrl = "https://www.loc.gov/search/?q=" + searchText + "&fo=json";
  // if (searchFormat != null) {
  //   apiUrl = apiUrl.replace("search", searchFormat);
  // }
  // // Need to add format
  // fetch(apiUrl)
  //   .then(function (response) {
  //     if (response.ok) {
  //       response.json().then(function (data) {
  //         // Display the results
  //         displaySearchResults(searchText, searchFormat, data.results);
  //       });
  //     } else {
  //       alert("Error: " + response.statusText);
  //     }
  //   })
  //   .catch(function (error) {
  //     alert("Unable to connect to the LOC");
  //   });
}

function displayWeatherData(searchText, searchResults) {
  removeAllChildNodes(searchResultsElement);
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

    alert(searchText);
  }
});

function init() {
  displayPreviousSearches();
}
init();
