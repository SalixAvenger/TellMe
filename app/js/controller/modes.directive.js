'use strict';

modesDirective.$inject = [];
module.exports = modesDirective;

function modesDirective() {
    return {
        restrict: 'EA',
        controller: 'ModesCtrl as modesController',
        templateUrl: 'modes.template.html',
        bindToController: true
    };

}