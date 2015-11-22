'use strict';

listDevicesDirective.$inject = [];
module.exports = listDevicesDirective;

function listDevicesDirective() {
    return {
        restrict: 'EA',
        controller: 'DevicesCtrl as deviceController',
        templateUrl: 'listDevices.template.html',
        bindToController: true
    };

}