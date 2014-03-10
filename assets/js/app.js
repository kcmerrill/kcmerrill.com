'use strict';

angular.module('chronicles', [
  'ngRoute',
  'chronicles.filters',
  'chronicles.services',
  'chronicles.directives',
  'chronicles.controllers',
  'AngularGM'
]).
config(function($sceDelegateProvider) {
 $sceDelegateProvider.resourceUrlWhitelist([
   'self',
   'http://www.youtube.com/**']);
}).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/loading', {template: '<div>Loading...</div>', controller: 'ChronicleCtrl'});
  $routeProvider.when('/:id', {template: '<div ng-include="chronicles.current.layout" class="content">Loading...</div>', controller: 'ChronicleCtrl'});
  $routeProvider.otherwise({redirectTo: '/loading'});
}]);
