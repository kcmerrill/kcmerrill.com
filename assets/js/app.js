'use strict';

angular.module('chronicles', [
  'ngRoute',
  'chronicles.filters',
  'chronicles.services',
  'chronicles.directives',
  'chronicles.controllers',
  'AngularGM'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/:id', {template: '<div ng-include="view" class="content">Loading...</div>', controller: 'ChronicleCtrl'});
  $routeProvider.otherwise({redirectTo: '/loading'});
}]);