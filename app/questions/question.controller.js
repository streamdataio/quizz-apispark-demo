'use strict';

(function() {

     function QuestionController($location, $scope, quizzConfig, questionService, voteService, apiSparkStreamdataioFactory) {
       var vm = this;

       vm.init = function() {
         questionService.getAll().then(function (result) {
           vm.questions = result;
           vm.currentQuestion = vm.questions[0];

           vm.streamdata = apiSparkStreamdataioFactory.newStreamdata(quizzConfig.quizzVotesUri)
             .onData(createChart)
             .onPatch(updateChart)
             .open();

           // simulate other users
           notifyCurrentQuestion();
         });
       };

       function createChart(votes) {
         updateChart(votes);
       }

       function updateChart(votes) {
         vm.votes = votes;
         vm.chartData = votes.filter(function(vote) {
           return vote.id == vm.currentQuestion.id;

         }).map(function(vote, i) {
           vote = voteService.voteWithTotal(vote);
           vote.color = '#fc841f';

           return vote;
         });
       }

       $scope.$on("$destroy", function() {
         // close the stream when we leave the page
         if (vm.streamdata) {
           vm.streamdata.close();

         }
       });

       vm.goToPrev = function() {
         vm.currentQuestion = vm.questions[vm.currentQuestion.id - 2];
         updateChart(vm.votes);

         notifyCurrentQuestion();
       };

       vm.goToNext = function() {
         if (vm.currentQuestion.id < vm.questions.length) {
           vm.currentQuestion = vm.questions[vm.currentQuestion.id];
           updateChart(vm.votes);

           notifyCurrentQuestion();

         } else {
           $location.path('/results');

         }
       };

       vm.isQuizzEnded = function() {
         return angular.isDefined(vm.currentQuestion) && vm.currentQuestion.id >= vm.questions.length;
       };

       vm.vote = function(choiceId) {
         var nanobar = new Nanobar({
           bg: "#27ae60"
         });
         nanobar.go(30);

         voteService.vote(vm.currentQuestion.id, choiceId)
           .then(function() {
              nanobar.go(100);
           });
       };

       function notifyCurrentQuestion() {
         // simulate other users
         $scope.$emit('question-page', { currentQuestion: vm.currentQuestion  });
       }

       vm.init();
     }

 angular
   .module('QuizzApp')
   .controller('QuestionController', ['$location', '$scope', 'quizzConfig',
     'questionService', 'voteService', 'apiSparkStreamdataioFactory', QuestionController]);
 })();