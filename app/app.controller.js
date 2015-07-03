'use strict';

(function () {

  function QuizzAppController($scope, $interval, $timeout, $location, $mdToast, questionService, voteService) {
    var vm = this;
    vm.simulateOthers = false;

    var interval;
    var questions = [];
    var voteInterval = 2000;
    var simulationDuration = 60000;

    function init() {
      questionService.getAll().then(function(q) {
        questions = q;
      });

      $scope.$on('question-page', function(evt, args) {
        if (vm.simulateOthers) {
          var currentQuestion = args['currentQuestion'];

          if (angular.isDefined(interval)) {
            $interval.cancel(interval);

          }

          interval = $interval(function() {
            if (angular.isDefined(currentQuestion)) {
              var random = Math.floor(Math.random() * currentQuestion.choices.length + 1);
              voteService.vote(currentQuestion.id, 'answer_' + random);
            }
          }, voteInterval);
        }

      });

      $scope.$on('result-page', function() {
        if (vm.simulateOthers) {
          if (angular.isDefined(interval)) {
            $interval.cancel(interval);

          }

          interval = $interval(function() {
            questions.forEach(function(question) {
              var choiceIdx = Math.floor(Math.random() * question.choices.length + 1);
              voteService.vote(question.id, 'answer_' + choiceIdx);

            });
          }, voteInterval);

          $timeout(function() {
            $scope.$emit('stop-players', {});
          }, simulationDuration);
        }

      });

      $scope.$on('stop-players', function() {
        stopPlayers();
      });

      $scope.$on("$destroy", function() {
        stopPlayers();
      });
    }

    vm.onChange = function(doSimulate) {
      if (doSimulate) {
        if ($location.path() == '/questions') {
          $scope.$emit('question-page', { currentQuestion: questions[0] });

        } else if ($location.path() == '/results') {
          $scope.$emit('result-page', { });

        }

        $mdToast.show(
          $mdToast.simple()
            .content('Simulate other players for ' + (simulationDuration / 1000) + 's')
            .position('false true false true')
            .hideDelay(3000)
        );

      } else {
        stopPlayers();
        $mdToast.show(
          $mdToast.simple()
            .content('Stop simulating other players')
            .position('false true false true')
            .hideDelay(3000)
        );
      }
    };

    function stopPlayers() {
      if (angular.isDefined(interval)) {
        $interval.cancel(interval);

      }

      vm.simulateOthers = false;
    }

    init();
  }

  angular
    .module('QuizzApp')
    .controller('QuizzAppController', ['$scope', '$interval', '$timeout', '$location','$mdToast',
      'questionService', 'voteService', QuizzAppController]);

})();