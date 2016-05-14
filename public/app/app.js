'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'myApp.view1',
  'myApp.view2',
  'myApp.view3',
  'myApp.view4',
  'myApp.view5',
  'myApp.view6',
  'myApp.view7',
  'myApp.view8',
  'myApp.version',
  'ngMessages',
  'angular-loading-bar',
  'ngResource'

 /* ,
  'ui.bootstrap'*/
 
]).
config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/customer', {
        templateUrl: 'view3/view3.html',
        controller: 'view3Ctrl'
      })
	  .when('/invoice', {
        templateUrl: 'view4/view4.html',
        controller: 'view4Ctrl'
      })
	  .when('/transactions', {
        templateUrl: 'view5/view5.html',
        controller: 'view5Ctrl'
      })
	  .when('/view6', {
        templateUrl: 'view6/view6.html',
        controller: 'view6Ctrl'
      })
	  .when('/view7', {
        templateUrl: 'view7/view7.html',
        controller: 'view7Ctrl'
      })
      .when('/view8', {
        templateUrl: 'view8/view8.html',
        controller: 'view8Ctrl'
        })
	  
  .otherwise({redirectTo: '/view1'});
}]);
