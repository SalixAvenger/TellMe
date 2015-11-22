'use strict';


require('angular');
require('angular-route');
require('angular-ui-bootstrap');

var app = angular.module('TellME', [
    'ngRoute',
    'ui.bootstrap',
    require('../../tmp/templates').name,
    require('./controller').name
]);

//app.constant('VERSION', require('../../package.json').version);

require('./controller');

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