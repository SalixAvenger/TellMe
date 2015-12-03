'use strict';

weatherDirective.$inject = [];
module.exports = weatherDirective;

function weatherDirective() {
    return {
        restrict: 'EA',
        controller: 'WeatherCtrl as weatherController',
        templateUrl: 'weather.template.html',
        bindToController: true
    };

}