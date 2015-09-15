'use strict';

var app = angular.module('myApp.view5', ['ngRoute'])

app.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view5', {
    templateUrl: 'view5/view5.html',
    controller: 'View5Ctrl'
  });
}])
app.controller('View5Ctrl', ['$scope', '$http', '$timeout', '$location', 'getTransactions', function($scope, $http, $timeout, $location, getTransactions){	
getTransactions.then(function(response) {
		console.dir(response)	
	$scope.transactions = response.data
})
	
}]);//controller

app.factory( 'getTransactions', [ '$http', function( $http ){
	return $http.get('/transactions')
	} ] )	
	
	


