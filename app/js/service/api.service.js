'use strict';

APIService.$inject = ['$http', '$q', '_'];
module.exports = APIService;

function APIService($http, $q, _) {
    var vm = this;

    vm.apiURL = "http://raspberrypi.local:3000/api/";

    vm.getDevices = getDevices;
    vm.turnOn = turnOn;
    vm.turnOff = turnOff;

    function getDevices() {
        var deferred = $q.defer();
        $http.get(vm.apiURL + 'devices')
            .then(function(response){
                deferred.resolve(response.data);
            })
            .catch(function(errorResponse){
                deferred.reject(errorResponse);
            });
        return deferred.promise;
    }

    function turnOn(device) {
        var deferred = $q.defer();
        $http.get(vm.apiURL + device + "/on")
            .then(function(response){
                deferred.resolve(response.data);
            })
            .catch(function(errorResponse){
                deferred.reject(errorResponse);
            });
        return deferred.promise;
    }

    function turnOff(device) {
        var deferred = $q.defer();
        $http.get(vm.apiURL + device + "/off")
            .then(function(response){
                deferred.resolve(response.data);
            })
            .catch(function(errorResponse){
                deferred.reject(errorResponse);
            });
        return deferred.promise;
    }
}