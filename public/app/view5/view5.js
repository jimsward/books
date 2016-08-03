'use strict';

var app = angular.module('myApp.view5', ['ngRoute'])

app.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view5', {
    templateUrl: 'view5/view5.html',
    controller: 'view5Ctrl'
  });
}])
app.controller('view5Ctrl', ['$scope', '$http', '$timeout', '$location', 'getTransactions', function($scope, $http, $timeout, $location, getTransactions){
	
			
$scope.transaction = {}
	var today = new Date()
	, dispFrom

	dispFrom = new Date('01-' + '01-' + today.getFullYear())
	$scope.transaction.from = dispFrom
	$scope.transaction.to = new Date()
	
$scope.run = function(){	
	
/*
	Probably will change this
*/
console.log($scope.transaction.from.toISOString())
	var re = /\-/g
	var obj = $scope.transaction.from.toISOString()
	var fromObj =  obj.substr(0, 10)
	var from = fromObj.replace(re, '/')
	obj = $scope.transaction.to.toISOString()
	var toObj = obj.substr(0, 10)
	var to = toObj.replace(re, '/')
	var params = {"from" : from, "to" : to }
	var promise = getTransactions.get(params)
	promise.then(
	function(response){		
	var totIncome = 0, totExpense = 0
	var totals = [], balance = 0, acctBalance = 0
	var catTotal = 0, acctTotal = 0
	var acct  = response.data[0].account
	, category = response.data[0].category
	//response is sorted so when a category changes, we store a subtotal and start another category
	response.data.forEach(function(value, index, array){
		//now, by account
		if (value.account == acct)
		{
			acctBalance += response.data[index].amount
		}
		else
		{
			totals.push( {account : acct, amount : acctBalance, split : "Total"} )
			acctBalance = value.amount
			acct = value.account
		}
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
		totals.push( {account : acct, amount : acctBalance, split : "Total"} )
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
	return {
		get :
		function(params){
			return $http({method : 'GET', url : '/transactions', params : params})
		}
	}
	} ] )
//dates are stored as yyyy/mm/dd for sorting and comparison but are displayed as mm/dd/yyyy
//this filter pivots the yyyy from the start to the end of the string
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
	
	


