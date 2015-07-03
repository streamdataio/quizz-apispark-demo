'use strict';

(function() {

  function questionService($resource, quizzConfig) {
    var restApi = $resource(quizzConfig.quizzQuestionsUri, {}, {
      'getAll': {
        method: 'GET',
        isArray: true,
        transformResponse: function (data) {
          var questions = angular.fromJson(data)
            .map(function(question) {
              var choices = [];
              for (var i = 1; i <= question.total_options; i++) {
                choices.push({ id: 'answer_' + i, label: question['answer_' + i] });
              }

              return { id: parseInt(question.id), question: question.question, choices: choices };
            });

          return questions;
        }
      }
    });

    function getAll() {
      return restApi.getAll().$promise;
    }

    return {
      getAll: getAll
    }
  }

  angular
    .module('QuizzApp')
    .factory('questionService', ['$resource', 'quizzConfig', questionService]);

})();