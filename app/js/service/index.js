'use strict';

module.exports = angular.module('TellME.services', [])
    .service('APIService', require('./api.service'))
    .service('WeatherService', require('./weather.service'));