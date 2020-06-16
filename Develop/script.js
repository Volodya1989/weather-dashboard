var apiKey = "14e021222c8a185e3f2105d338b643d8";
var dailyApi = `https://api.openweathermap.org/data/2.5/forecast?appid=${apiKey}`;

$(document).ready(function () {
  var searchBth = $("#search-button");
  var cities=[];

  searchBth.on("click", function () {
    var city = $("#search-field").val();
    cities.push(city)
    console.log(cities);
    var queryURL = `${dailyApi}&q=${city}`;
    console.log(queryURL);

    $.ajax({
      url: queryURL,
      method: "GET",
    }).then(function (response) {
      var temp = Math.floor((response.list[0].main.temp - 273.15) * 1.8 + 32);
      $("#temperature").text(temp + " F");
      var hum = response.list[0].main.humidity;
      $("#humidity").text(hum + " %");
      var wind = response.list[0].wind.speed;
      $("#wind-speed").text(wind + " MPH");
      //needs to be fixed
      var uvIndex = response.list[0].wind.speed;
      $("#uv-index").text(uvIndex + " index");

    });
    renderButtons()
  });

  function renderButtons() {
    // Deletes the cities prior to adding new cities
    // (this is necessary otherwise you will have repeat buttons)
    $("#cities-list").empty();

    // Loops through the array of cities
    for (var i = 0; i < cities.length; i++) {
      // Then dynamicaly generates buttons for each city in the array
      var a = $(
        `<li><button class='cities' data-city='${cities[i]}'>${cities[i]}</button></li>`
      );
      $("#cities-list").append(a);

    }
  }
});
