'use strict';

module.exports = ['$scope', '$http', '_', 'APIService', function($scope, $http, _, APIService){

    var vm = this;

    vm.changeMode = changeMode;

    function _turnOn(device) {
        APIService.turnOn(device)
            .then(function(results){
                console.log(results);
            });
    }

    function _turnOff(device) {
        APIService.turnOff(device)
            .then(function(results){
                console.log(results);
            });
    }

    function changeMode(mode) {
        switch (mode) {
            case 'film' :
                _turnOn(1);
                _turnOn(2);
                _turnOn(3);
                _turnOn(4);
                _turnOff(5);
                _turnOff(6);
                break;
            case 'evening' :
                _turnOn(1);
                _turnOn(2);
                _turnOn(3);
                _turnOn(4);
                _turnOn(5);
                _turnOn(6);
                break;
            case 'night' :
                _turnOff(1);
                _turnOn(2);
                _turnOn(3);
                _turnOff(4);
                _turnOff(5);
                _turnOff(6);
                break;
            case 'off' :
                _turnOff(1);
                _turnOff(2);
                _turnOff(3);
                _turnOff(4);
                _turnOff(5);
                _turnOff(6);
                break;
        }
    }

}];
