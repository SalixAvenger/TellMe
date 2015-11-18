'use strict';


var angular = require('angular');
require('angular-route');

var app = angular.module('TellME', [ 'ngRoute' ]);

app.constant('VERSION', require('../../package.json').version);

require('./controller');

app.config(function($routeProvider) {

    $routeProvider.when('/', {
            templateUrl: 'views/home.template.html',
            controller: 'HomeCtrl'
        })
        /*.when('/list', {
            templateUrl: 'views/listDevices.template.jade',
            controller: 'ListDevicesCtrl'
        })*/
        .otherwise({
            redirectTo: '/'
        });
});