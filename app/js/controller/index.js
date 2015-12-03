'use strict';

module.exports = angular.module('TellME.controllers', [])
    .controller('HomeCtrl', require('./home.controller'))
    .controller('DevicesCtrl', require('./listDevices.controller'))
    .controller('WeatherCtrl', require('./weather.controller'))
    .controller('ModesCtrl', require('./modes.controller'))

    .directive('listDevicesDirective', require('./listDevices.directive'))
    .directive('modesDirective', require('./modes.directive'))
    .directive('weatherDirective', require('./weather.directive'));