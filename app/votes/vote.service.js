'use strict';

(function() {

  function voteService($resource, $q, quizzConfig) {
    var restApi =
      $resource(quizzConfig.quizzVotesUri + '/:voteId', { voteId: '@id' }, {
        'update': {
          method: 'PUT',
          transformResponse: function(data) {
            return transformVote(angular.fromJson(data));
          }
        },
        'getAll': {
          method: 'GET',
          isArray: true,
          transformResponse: function(data) {
            return angular.fromJson(data).map(transformVote);
          }
        }
      });

    function transformVote(vote) {
      vote.total = vote['answer_1'] + vote['answer_2'] + vote['answer_3'] + vote['answer_4'];

      return vote;
    }

    function vote(questionId, choiceId) {
      var deferred = $q.defer();

      restApi.get({voteId: questionId}).$promise
        .then(function(vote) {
          var count = parseInt(vote[choiceId]);
          vote[choiceId] = count + 1;

          deferred.resolve(restApi.update({ voteId: vote.id }, vote));
        });
      return deferred.promise;
    }

    function getAll() {
      return restApi.getAll().$promise;
    }

    return {
      vote: vote,
      voteWithTotal: transformVote,
      getAll: getAll // deprecated
    }
  }

  angular
    .module('QuizzApp')
    .factory('voteService', ['$resource', '$q', 'quizzConfig', voteService]);

})();