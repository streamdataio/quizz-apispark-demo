'use strict';

(function() {
    angular
        .module('QuizzApp')
        .config(['$routeProvider', function($routeProvider) {
          $routeProvider.when('/question', {
            templateUrl: 'app/questions/question.html',
            controller: 'QuestionController',
            controllerAs: 'questionCtrl'
          });
        }]
        );
})();