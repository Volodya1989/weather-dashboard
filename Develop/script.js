//Volodymyr Petrytsya   06/16/20

$(document).ready(function () {
  //api key and link itself
  var apiKey = "14e021222c8a185e3f2105d338b643d8";
  var dailyApi = `https://api.openweathermap.org/data/2.5/forecast?appid=${apiKey}`;
  //variable for listener and array for cities user inputs
  var searchBth = $("#search-button");
  var cities = [];
  // function responsible for getting info from local storage assigned to variable
  var cachedData = getCachedData();

  //taking keys from local storage and assign to variable
  var cachedCityNames = Object.keys(cachedData);
  //iterating through info in local storage to get it back
  for (var i = 0; i < cachedCityNames.length; i++) {
    var cityName = cachedCityNames[i];

    var cityData = cachedData[cityName];
    console.log(cityName)
    cities.push(cityData);
  }
  //if local storage is not empty, then prepending info that we are getting back from local storage
  if (cities.length) {
    var cityByDefault = cities[cities.length - 1];
    showPageConten();
    renderButtons();
    renderWeatherInfo(cityByDefault);
  }
  //function to get info from local storage
  function getCachedData() {
    var data = localStorage.getItem("data");
    if (data) {
      data = JSON.parse(data);
    } else {
      data = {};
    }
    return data;
  }
  //function to save info in local storage
  function saveDataInCache(data) {
    localStorage.setItem("data", JSON.stringify(data));
  }
  //function to show hidden content
  function showPageConten() {
    $(".hide-list").show();
    $("#forecast-id").show();
    $("#forecast-cards").show();
    $("#title-day-forecast").show();
  }
  function ajaxInfo(city) {
    var cachedData = getCachedData();
    var cityExists = cachedData[city];
    if (cityExists) {
      renderWeatherInfo(cachedData[city]);
      return;
    }
    var queryURL = `${dailyApi}&q=${city}`;
    console.log(queryURL);
    // function for ajax call
    $.ajax({
      url: queryURL,
      method: "GET",
    }).then(function (response) {
      cachedData[city] = response;
      console.log(cachedData[city]);
      saveDataInCache(cachedData);
      cities.push(response);
      renderButtons();
      renderWeatherInfo(response);
    });
  }

  //function to dynamically  generate 5 days cards and display info received through API call
  function renderCards(response) {
    var cardDays = $(`.forecast-days`);
    $(".forecast-days").empty();
    for (var i = 0; i < response.list.length; i++) {
      if (response.list[i].dt_txt.indexOf("15:00:00") !== -1) {
        let tempCard = Math.floor(
          (response.list[i].main.temp - 273.15) * 1.8 + 32
        );
        var timeCard = new Date(response.list[i].dt_txt).toLocaleDateString();
        var humCard = response.list[i].main.humidity;
        var icon = response.list[i].weather[0].icon;
        var carEl1 = $(` <div
    class="card text-white bg-primary mb-3"
    style="max-width: 10rem;"
  >
    <div class="card-body forecast-cards">
      <h5 class="card-title">${timeCard}</h5>
      <div id="icon-card"><img id="wicon" src="https://openweathermap.org/img/w/${icon}.png" alt="Weather icon" /></div>
      <p>Temp: <span class="card-temp">${tempCard} F\xB0</span></p>
                    <p>Hum: <span class="card-hum">${humCard} %</span></p>
    </div>
  </div> `);
        cardDays.append(carEl1);
      }
    }
  }
  //function to dynamically  generate elements and display info received through API call
  function renderWeatherInfo(response) {
    var timeBlock = moment().format("L");
    var cityName = response.city.name;
    $("#city").text(`${cityName} (${timeBlock}) `);
    var temp = Math.floor((response.list[0].main.temp - 273.15) * 1.8 + 32);
    $("#icon").empty();
    var icon = response.list[0].weather[0].icon;
    $("#icon").append(
      `<img id="wicon" src="https://openweathermap.org/img/w/${icon}.png" alt="Weather icon" />`
    );
    $("#temperature").text(temp + " F\xB0");
    var hum = response.list[0].main.humidity;
    $("#humidity").text(hum + " %");
    var wind = response.list[0].wind.speed;
    $("#wind-speed").text(wind + " MPH");
    secondAjaxCall(response);
    renderCards(response);
  }
  function secondAjaxCall(response) {
    var lon = response.city.coord.lon;
    var lat = response.city.coord.lat;
    var uvIndexAPI = `https://api.openweathermap.org/data/2.5/uvi?appid=${apiKey}&lat=${lat}&lon=${lon}`;
    //second ajax call for uv index
    $.ajax({
      url: uvIndexAPI,
      method: "GET",
    }).then(function (uv) {
      var uvIndex = uv.value;

      $("#uv-index").text(uvIndex);
      if (uvIndex < 3) {
        $("#uv-index").attr("style", "background-color:green; padding: 5px;");
      } else if (uvIndex < 7) {
        $("#uv-index").attr("style", "background-color:orange; padding: 5px;");
      } else {
        $("#uv-index").attr("style", "background-color:red; padding: 5px;");
      }
    });
  }
  //read users input
  function displayCityInfo() {
    var city = $("#search-field").val();
    if (city == "") {
      return;
    }
    showPageConten();
    ajaxInfo(city);
  }
  // fucntion that dislays info about each city on  clicking on the city in the list
  function cityInfoOnButtonPush() {
    var city = $(this).attr("data-city");
    var cityData = cities.find(function (cityData) {
      return cityData.city.name === city;
    });
    renderWeatherInfo(cityData);
  }

  function renderButtons() {
    // Deletes the cities prior to adding new cities
    $("#cities-list").empty();

    // Loops through the array of cities
    for (var i = 0; i < cities.length; i++) {
      var cityData = cities[i];
      // Then dynamicaly generates buttons for each city in the array
      var a = $(
        `<li class='list-group-item cities' data-city='${cityData.city.name}'>${cityData.city.name}</li>`
      );
      $("#cities-list").prepend(a);
    }
  }
  //listener on search button
  searchBth.on("click", function () {
    displayCityInfo();
  });
  //listener on list of cities
  $(document).on("click", ".cities", cityInfoOnButtonPush);
});
