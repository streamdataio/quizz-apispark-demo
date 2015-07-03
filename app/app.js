'use strict';

(function() {
    angular
        .module('QuizzApp', ['ngSanitize','ngResource', 'ngRoute', 'ngMaterial'])
        .constant('quizzConfig', {
            'quizzQuestionsUri': 'https://status-code-quiz.apispark.net/v1/questions',
            'quizzVotesUri': 'https://status-code-quiz.apispark.net/v1/votes',
            'quizzAnswerUri': 'https://status-code-quiz.apispark.net/v1/answers',
            'apiSparkLogin': '[YOUR API SPARK APP LOGIN]',
            'apiSparkPassword': '[YOUR API SPARK PASSWORD]',
            'streamdataioAppToken': '[YOUR STREAMDATA.IO APP TOKEN]'
        })
        .config(function($httpProvider) {
           $httpProvider.interceptors.push('apiSparkInterceptor');
        })
        .config(['$routeProvider', function($routeProvider) {
          $routeProvider.otherwise({
            redirectTo: '/question'
          });
        }]);
})();
