var apiKey = "14e021222c8a185e3f2105d338b643d8";
var dailyApi = `https://api.openweathermap.org/data/2.5/forecast?appid=${apiKey}`;

$(document).ready(function () {
  var searchBth = $("#search-button");

  searchBth.on("click", function () {
    var city = $("#search-field").val();
    console.log(city);
    var queryURL = `${dailyApi}&q=${city}`;
    console.log(queryURL);

    $.ajax({
      url: queryURL,
      method: "GET",
    }).then(function (response) {
      var temp = Math.floor((response.list[0].main.temp- 273.15) * 1.8 + 32);
      $("#temperature").text(temp+ " F")
      var hum = response.list[0].main.humidity;
      $("#humidity").text(hum + " %" )
      var wind = response.list[0].wind.speed;
      $("#wind-speed").text(wind+ " MPH")
      //needs to be fixed
      var uvIndex = response.list[0].wind.speed;
      $("#uv-index").text(uvIndex+ " index")

    });
  });
});









