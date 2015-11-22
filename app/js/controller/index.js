'use strict';

module.exports = angular.module('TellME.controllers', [])
    .controller('HomeCtrl', require('./home.controller'))
    .controller('DevicesCtrl', require('./listDevices.controller'))
    .directive('listDevicesDirective', require('./listDevices.directive'));