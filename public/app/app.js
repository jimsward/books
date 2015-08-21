'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'myApp.view1',
  'myApp.view2',
  'myApp.view3',
  'myApp.version',
  'ngResource'
 /* ,  'ngMessages'*/
]).
config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/customer', {
        templateUrl: 'view3/view3.html',
        controller: 'View3Ctrl'
      })
  .otherwise({redirectTo: '/view1'});
}]);
