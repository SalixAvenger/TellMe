/**
 * Created by joel on 2015-12-02.
 */
//http://opendata-download-metfcst.smhi.se/api/category/pmp1.5g/version/1/geopoint/lat/57.71/lon/11.97/data.json

'use strict';

WeatherService.$inject = ['$http', '$q', '_'];
module.exports = WeatherService;

function WeatherService($http, $q, _) {

    var vm = this;

    vm.weatherUrl = "http://opendata-download-metfcst.smhi.se/api/category/pmp1.5g/version/1/geopoint/lat/57.71/lon/11.97/data.json";
    vm.getWeather = getWeather;

    function getRawWeather() {

    }

    /*
    Returns simpler weather forecast
     */
    function getWeather() {
        var deferred = $q.defer();
        $http.get(vm.weatherUrl)
            .then(function(results){
                console.log(results);
                var list = results.data.timeseries;

                list = _.filter(list, function(o){
                    var thisDate = new Date(o.validTime);
                    return thisDate > Date.now();
                });
                //console.dir(list);
                //list = _.indexBy(list, 'validTime');
                //console.dir(list);
                deferred.resolve(list);
            })
            .catch(function(errorResponse){
                deferred.reject(errorResponse);
            });
        return deferred.promise;
    }
}