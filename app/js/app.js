'use strict';


require('angular');
require('angular-route');
require('angular-ui-bootstrap');
var _ = require('underscore');

var app = angular.module('TellME', [
    'ngRoute',
    'ui.bootstrap',
    require('../../tmp/templates').name,
    require('./controller').name,
    require('./service').name
]);

app.constant('_', _);

//require('./controller');
app.config(function($routeProvider) {

    $routeProvider.when('/', {
            templateUrl: 'home.template.html',
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

