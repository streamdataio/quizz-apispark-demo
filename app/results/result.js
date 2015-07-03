'use strict';

(function() {
    angular
        .module('QuizzApp')
        .config(['$routeProvider', function($routeProvider) {
          $routeProvider.when('/results', {
            templateUrl: 'app/results/result.html',
            controller: 'ResultController',
            controllerAs: 'resultCtrl'
          });
        }]
        );
})();