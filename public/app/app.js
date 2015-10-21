'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'myApp.view1',
  'myApp.view2',
  'myApp.view3',
  'myApp.view4',
  'myApp.view5',
  'myApp.version',
  'ngMessages',
  'ngResource'
 /* ,
  'ui.bootstrap'*/
 
]).
config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/customer', {
        templateUrl: 'view3/view3.html',
        controller: 'View3Ctrl'
      })
	  .when('/invoice', {
        templateUrl: 'view4/view4.html',
        controller: 'View4Ctrl'
      })
	  .when('/transactions', {
        templateUrl: 'view5/view5.html',
        controller: 'View5Ctrl'
      })
	  
  .otherwise({redirectTo: '/view1'});
}]);
