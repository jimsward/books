'use strict';

var app = angular.module('myApp.view5', ['ngRoute'])

app.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view5', {
    templateUrl: 'view5/view5.html',
    controller: 'View5Ctrl'
  });
}])
app.controller('View5Ctrl', ['$scope', '$http', '$timeout', '$location', 'getTransactions', function($scope, $http, $timeout, $location, getTransactions){
	
			
$scope.transaction = {}
	var today = new Date()
	, dispTo, dispFrom
	dispTo =  today.getMonth() + 1
	if (dispTo < 10 )dispTo = '0' + dispTo  
	+ '/' + today.getDate() + '/' + today.getFullYear()
	dispFrom = '01/' + '01/' + today.getFullYear()
	$scope.transaction.from = dispFrom
	$scope.transaction.to = dispTo
	
$scope.run = function(){	
	var fromparts = $scope.transaction.from.split('/')
	var from =  fromparts[2] + '/' + fromparts[0] + '/' + fromparts[1]	
	var toparts = $scope.transaction.to.split('/')
	var to =  toparts[2] + '/' + toparts[0] + '/' + toparts[1]		
	var params = {"from" : from, "to" : to }	
	$http({method : 'GET', url : '/transactions', params : params}).then(	
	function(response){		
	var totIncome = 0, totExpense = 0
	var totals = [], balance = 0
	var catTotal = 0
	, category = response.data[0].category
	//response is sorted so when a category changes, we store a subtotal and start another category
	response.data.forEach(function(value, index, array){
		if (value.category == category)
		{balance += response.data[index].amount
		value.balance = balance
		totals.push(value)
		}		
		else
		{	
		totIncome = balance
		totals.push( { category : category, balance : balance, split : "Total" } )	
		balance = value.amount
		category = value.category
		}
		})//forEach
		totExpense = balance
		totals.push( { category : category, balance : balance, split : "Total" } )	
		totals.push( { category : "Net Income", balance : totIncome - totExpense, split : "Total" } )	
		$scope.transactions = totals
		//$scope won't get updated until the next $digest; let's give it a couple seconds
		$timeout(function(){
		$("table tr:contains('Total')").addClass( "totals" )
			}, 2000)
		})//$http								
}//run	
}]);//controller
app.factory( 'getTransactions', [ '$http', function( $http ){
	return function( params ){$http.get('/transactions', params)	
	}	
	} ] )
//dates are stored as yyyy/mm/dd for sorting and somparison but are displayed as mm/dd/yyyy
//this filter pivots the yyyy from the start to thend of the string
app.filter('pivot', function(){	
	return function(input){
		if (input)
	{
		var out = ""
		var year = input.substr(0,4)
		out = input.slice(5)
		out = out + '/' + year 
		return out
	}
		else return
	}
	})
	
	


