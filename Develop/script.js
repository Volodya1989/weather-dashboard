$(document).ready(function () {
  var apiKey = "14e021222c8a185e3f2105d338b643d8";
  var dailyApi = `https://api.openweathermap.org/data/2.5/forecast?appid=${apiKey}`;

  var searchBth = $("#search-button");
  var cities = [];

  function displayCityInfo() {
    var city = $("#search-field").val();
    if (city == "") {
      return;
    }
    cities.push(city);
    console.log(cities);
    var queryURL = `${dailyApi}&q=${city}`;
    console.log(queryURL);

    $.ajax({
      url: queryURL,
      method: "GET",
    }).then(function (response) {
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
    });
    renderButtons();
  }

  function cityInfoOnButtonPush() {
    var city = $(this).attr("data-city");
    var queryURL = `${dailyApi}&q=${city}`;
    console.log(queryURL);

    $.ajax({
      url: queryURL,
      method: "GET",
    }).then(function (response) {
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
   
    });
  }
  function renderButtons() {
    // Deletes the cities prior to adding new cities
    // (this is necessary otherwise you will have repeat buttons)
    $("#cities-list").empty();

    // Loops through the array of cities
    for (var i = 0; i < cities.length; i++) {
      // Then dynamicaly generates buttons for each city in the array
      var a = $(
        `<li class='list-group-item cities' data-city='${cities[i]}'>${cities[i]}</li>`
      );
      $("#cities-list").append(a);
    }
  }

  searchBth.on("click", function () {
    $(".hide-list").show();
    $("#forecast-id").show();
    displayCityInfo();
  });

  $(document).on("click", ".cities", cityInfoOnButtonPush);
});

// var storageData = localStorage.getItem('data');

// if (storageData) {
//   storageData = JSON.parse(storageData);
// } else {
//   storageData = {};
// }

// var cities = Object.keys(storageData);

// for (var i = 0; i < cities.length; i++) {
//   var city = cities[i];
// }
