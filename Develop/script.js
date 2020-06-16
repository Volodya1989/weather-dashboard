$(document).ready(function () {
  var apiKey = "14e021222c8a185e3f2105d338b643d8";
  var dailyApi = `https://api.openweathermap.org/data/2.5/forecast?appid=${apiKey}`;

  var searchBth = $("#search-button");
  var cities = [];
  var cachedData = getCachedData();
  var cachedCityNames = Object.keys(cachedData);

  for (var i = 0; i < cachedCityNames.length; i++) {
    var cityName = cachedCityNames[i];
    var cityData = cachedData[cityName];

    cities.push(cityData);
  }

  if (cities.length) {
    var cityByDefault = cities[cities.length - 1];

    showPageConten();
    renderButtons();
    renderWeatherInfo(cityByDefault);
  }


  function getCachedData () {
    var data = localStorage.getItem("data");

    if (data) {
      data = JSON.parse(data);
    } 
    else {
      data = {};
    }

    return data;
  }

  function saveDataInCache (data) {
    localStorage.setItem("data", JSON.stringify(data));
  }

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

    $.ajax({
      url: queryURL,
      method: "GET",
    }).then(function (response) {
      cachedData[city] = response;
      saveDataInCache(cachedData);
      cities.push(response);
      renderButtons();
      renderWeatherInfo(response);
    });
  }

  function renderWeatherInfo (response) {
      var timeBlock = moment().format("L");
      console.log(timeBlock);
      var cityName = response.city.name;
      $("#city").text(`${cityName} (${timeBlock}) `);
      var temp = Math.floor((response.list[0].main.temp - 273.15) * 1.8 + 32);
      $("#temperature").text(temp + " F");
      var hum = response.list[0].main.humidity;
      $("#humidity").text(hum + " %");
      var wind = response.list[0].wind.speed;
      $("#wind-speed").text(wind + " MPH");

      $(".card-title").text(timeBlock);
      var tempCard = Math.floor(
        (response.list[0].main.temp - 273.15) * 1.8 + 32
      );
      $(".card-temp").text(tempCard + " F");
      var humCard = response.list[1].main.humidity;
      $(".card-hum").text(humCard + " %");
      //needs to be fixed
      var uvIndex = response.list[1].wind.speed;
      $("#uv-index").text(uvIndex);
  }

  function displayCityInfo() {
    var city = $("#search-field").val();
    if (city == "") {
      return;
    }
    showPageConten();
    ajaxInfo(city);
  }

  function cityInfoOnButtonPush() {
    var city = $(this).attr("data-city");
    var cityData = cities.find(function (cityData) {
      return cityData.city.name === city;
    });

    renderWeatherInfo(cityData);
  }
  
  function renderButtons() {
    // Deletes the cities prior to adding new cities
    // (this is necessary otherwise you will have repeat buttons)
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

  searchBth.on("click", function () {
    displayCityInfo();
  });

  $(document).on("click", ".cities", cityInfoOnButtonPush);
});

