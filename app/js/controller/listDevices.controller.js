'use strict';

module.exports = ['$scope', '$http', '_', 'APIService', '$rootScope',
    function($scope, $http, _, APIService, $rootScope){

    var vm = this;

    vm.devices = [];
    vm.radioModel = [];

    vm.start = start;
    vm.updateDevice = updateDevice;

    function start() {
        APIService.getDevices()
            .then(function(results){
                console.log(results);
                if(results.error) {
                    console.error("Could not load list:");
                    console.error(results.error);
                } else {
                    vm.devices = results;
                    vm.radioModel = _.map(vm.devices, function (d) {
                        return d.on;
                    });
                }
            });
    }

    function updateDevice(device, button) {
        if(!device.on && vm.radioModel[button]) {
            console.log("turning on " + device.name);
            device.on = !device.on;
            APIService.turnOn(device.id)
                .then(function(results){
                    console.log(results);
                });

        } else if(device.on && !vm.radioModel[button]) {
            console.log("turning off " + device.name);
            device.on = !device.on;

            APIService.turnOff(device.id)
                .then(function(results){
                    console.log(results);
                });
        }

    }

    $rootScope.$on('APIService::updateDevice', function(event, args) {
        vm.devices = args;
        vm.radioModel = _.map(vm.devices, function (d) {
            return d.on;
        });
        console.log("Update devices");
        console.dir(args);
    });

    vm.start();
}];
