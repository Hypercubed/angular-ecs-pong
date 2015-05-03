'use strict';

/**
 * @ngdoc function
 * @name angularEcsPongApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the angularEcsPongApp
 */
angular.module('angularEcsPongApp')
  .controller('AboutCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
