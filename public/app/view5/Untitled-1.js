'use strict';

var app = angular.module('myApp.view5', ['ngRoute'])

app.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view5', {
    templateUrl: 'view5/view5.html',
    controller: 'View5Ctrl'
  });
}])
app.controller('View5Ctrl', ['$scope', '$http', '$timeout', '$location', function($scope, $http, $timeout, $location){	

	
}]);//controller

	
	
	


