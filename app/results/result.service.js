'use strict';

(function() {

  function resultService($resource, quizzConfig) {
    var answerApi = $resource(quizzConfig.quizzAnswerUri, {}, {
      'getAll': {
        method: 'GET',
        isArray: true,
        transformResponse: function(data) {
          return angular.fromJson(data);
        }
      }
    });

    return {
      getAll: function() {
        return answerApi.getAll().$promise;
      }
    }
  }

  angular
    .module('QuizzApp')
    .factory('resultService', ['$resource', 'quizzConfig', resultService]);

})();