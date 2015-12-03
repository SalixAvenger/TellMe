'use strict';

module.exports = angular.module('TellME.controllers', [])
    .controller('HomeCtrl', require('./home.controller'))
    .controller('DevicesCtrl', require('./listDevices.controller'))
    .controller('WeatherCtrl', require('./weather.controller'))

    .directive('listDevicesDirective', require('./listDevices.directive'))
    .directive('weatherDirective', require('./weather.directive'));