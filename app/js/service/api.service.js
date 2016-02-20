'use strict';

APIService.$inject = ['$http', '$q', '_', '$rootScope'];
module.exports = APIService;

function APIService($http, $q, _, $rootScope) {
    var vm = this;

    vm.apiURL = "http://raspberrypi.local:3000/api/";

    vm.getDevices = getDevices;
    //vm.updateDevices = updateDevices;
    vm.turnOn = turnOn;
    vm.turnOff = turnOff;
    vm.devices = [];

    /*function updateDevices() {
        $http.get(vm.apiURL + 'devices')
            .then(function(response){
                $rootScope.$broadcast('APIService::updateDevices', {data: response.data});
            })
            .catch(function(errorResponse){
                console.error("Could not update devices: " + errorResponse);
            });
    }*/

    function getDevices() {
        var deferred = $q.defer();
        $http.get(vm.apiURL + 'devices')
            .then(function(response){
                vm.devices = response.data;
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
                vm.devices[device-1].on = true;
                $rootScope.$broadcast('APIService::updateDevice', vm.devices);
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
                vm.devices[device-1].on = false;
                $rootScope.$broadcast('APIService::updateDevice', vm.devices);
            })
            .catch(function(errorResponse){
                deferred.reject(errorResponse);
            });
        return deferred.promise;
    }
}