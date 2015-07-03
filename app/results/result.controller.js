'use strict';

(function() {

  function ResultController($location, $scope, $q, quizzConfig, questionService, resultService, apiSparkStreamdataioFactory) {
    var colors = color.randomColors(4);

    var vm = this;
    vm.results = [];
    vm.showAnswers = false;
    vm.loading = true;

    vm.init = function() {

      $q.all([questionService.getAll(), resultService.getAll()])
        .then(function(results) {
            var questions = results[0];
            var answers = results[1];

        vm.results = questions.reduce(function(resultsMap, question, index) {
          var choices = question.choices.map(function(choice, j) {
            return { total: 0, label: choice.label, color: colors[j].color };
          });

          var answerId = answers[index].answer - 1;
          var answer = choices[answerId].label;

          resultsMap[question.id] = { id: question.id, question: question.question, choices: choices, answer: answer };
          return resultsMap;
        }, {});
      }).then(function() {
        vm.loading = false;

      }).then(function() {
        vm.streamdata = apiSparkStreamdataioFactory.newStreamdata(quizzConfig.quizzVotesUri)
          .onData(createChart)
          .onPatch(updateChart)
          .open();

        // simulate users
        $scope.$emit('result-page', {});
      });
    };

    function createChart(votes) {
      updateChart(votes);
    }

    function updateChart(votes) {
      votes.forEach(function(vote) {
        vm.results[vote.id].choices.forEach(function(choice, i) {
          choice.total = parseInt(vote['answer_' + (i + 1)]);
        });
      });
    }

    $scope.$on("$destroy", function() {
      // close the stream when we leave the page
      if (vm.streamdata) {
        vm.streamdata.close();

      }
    });

    vm.goToQuizzStart = function() {
      $location.path("/question");

    };

    vm.init();
  }

  angular
    .module('QuizzApp')
    .controller('ResultController', ['$location', '$scope', '$q', 'quizzConfig',
      'questionService', 'resultService', 'apiSparkStreamdataioFactory', ResultController]);

})();
