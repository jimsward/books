'use strict';

var app = angular.module('myApp.view3', ['ngRoute'])

app.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view3', {
    templateUrl: 'view3/view3.html',
    controller: 'View3Ctrl'
  });
}])
app.controller('View3Ctrl', ['$scope', '$routeParams','$http', function($scope, $routeParams, $http){	
	$scope.customer = $routeParams	
	console.log($scope.customer)
	angular.element( '#tabs' ).tabs()
	
	var params = {}
	$scope.details = {}
	params.name = $scope.customer.name
	$http( {
		url : '/customer',
		method : 'GET',
		params : params
		} )
		.then( function(response){
			console.log('data ' + response.data.invoices.length)
			var detailsArr = response.data.invoices.concat(response.data.entries)
			
			detailsArr.sort( function(a,b){
				if ( a.date > b.date )
				{
				return 1;
				}
				if ( a.date < b.date )
				{
				return -1;
				}
				return 0;
			})
			
			for ( var i = 0; i < detailsArr.length; i++ )
			{
			var dateArr = detailsArr[i].date.split('/')
			detailsArr[i].date = dateArr[1] + '/' +dateArr[2] + '/' + dateArr[0]
			}
			
			$scope.details = detailsArr
						
		//console.log($scope.details)
			})
					
}]);//controller
