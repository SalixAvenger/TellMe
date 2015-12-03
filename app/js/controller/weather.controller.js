'use strict';

module.exports = ['WeatherService', '_', '$interval', function(WeatherService, _, $interval){
    console.log("Weather ctrl loaded");
    var vm = this;

    vm.updateWeather = updateWeather;
    vm.currentWeatherData = {
        currentTemp : null,
        currentCloudCoverage : null,
        currentIcon : null,
        currentWindSpeed : null,
        currentWindDirection : null,
        currentPrecipitation : null
    };
    vm.weatherData = null;
    vm.wdlength = 0;
    vm.time = Date.now();

    var tick = function() {
        vm.time = Date.now();
    };
    $interval(tick, 1000);


    function updateWeather() {
        console.log("getting weather");
        WeatherService.getWeather()
            .then(function(results){
                console.log(results);
                var firstInList = results[0];//_.find(results, function(o){return true;});
                vm.weatherData = results;
                vm.wdlength = vm.weatherData.length;
                vm.currentWeatherData.currentTemp = firstInList.t;
                vm.currentWeatherData.currentCloudCoverage = firstInList.tcc;
                vm.currentWeatherData.currentWindSpeed = firstInList.ws;
                vm.currentWeatherData.currentWindDirection = firstInList.wd;
                // Random wind dir for testing
                //vm.currentWeatherData.currentWindDirection = Math.floor(Math.random() * 360);
                vm.currentWeatherData.currentPrecipitation = firstInList.pit;

                switch (firstInList.pcat) {
                    case 0 :
                        vm.currentWeatherData.currentIcon = "B";
                        break;
                    case 1 :
                        vm.currentWeatherData.currentIcon = "U";
                        break;
                    case 2 :
                        vm.currentWeatherData.currentIcon = "W";
                        break;
                    case 3 :
                        vm.currentWeatherData.currentIcon = "R";
                        break;
                    case 4 :
                        vm.currentWeatherData.currentIcon = "Q";
                        break;
                    case 5 :
                        vm.currentWeatherData.currentIcon = "W";
                        break;
                    case 6 :
                        vm.currentWeatherData.currentIcon = "X";
                        break;
                    default :
                        vm.currentWeatherData.currentIcon = "M";
                }


                console.dir(vm.currentWeatherData);
            });
    }



    updateWeather();
}];
