'use strict';
var app = angular.module('myApp.view1', ['ngRoute'])
app.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'view1Ctrl'
  });
}])
//Populate the table with checkbook entries
/**
 * description Controller for the table of check entries
 *
 * @param {string} a
 */
app.controller('view1Ctrl', [ '$scope', 'getEntries', '$http', '$location', '$routeParams', '$route', '$rootScope', '$compile', function($scope, getEntries, $http, $location, $routeParams, $route, $rootScope, $compile){
	$rootScope.currentNavItem="checking"
	var promise = getEntries
	promise.then(function(response){
	$scope.items = response.data.items
		return response
	}).then(function(response){
		/*$scope.username = response.data.username
		$rootScope.user = $scope.username ? true : false*/
	})
	$scope.openForm = function(item){
		$rootScope.selected = item
		angular.element('entry-form').remove()
		$('tr#' + item.id).replaceWith($compile("<entry-form />")($scope));
	}
	}])//controller
app.factory( 'getEntries', [ '$http', function($http) {	 
    return $http({url : '/entries', method : 'GET'})
	}])
app.factory('addEntry', ['$http', function($http) {
	return {
		newEnt: function (data) {
			return $http({url: '/newentry', data: data, method: "POST"})
		}
	}
}])
app.directive('maskmoney', function(){	      
	return {
	link : function(scope,element,attrs, ngModel){
		element.maskMoney();	
		}
	}
});
//Placed on an input element, GETs the list of accounts from db
//and verifies that input is in that list - this is a required field
app.directive('listaccts', [ '$http', function($http){	
	return {
	require : 'ngModel',
	link : function(scope,element,attrs, ngModel){
		 var accounts = new Array		 				
		$http( {
    	url: '/accounts',
   	 	method: "GET"}		 
		)
		.then( function(msg){
			angular.forEach(msg.data, function(value, key){
			accounts[key] = value.account;
			})	
			element.autocomplete({
  				    source: accounts					
					})
			element.on( "autocompletechange", function(event, ui){
				var val = event.target.value				
				if (accounts.indexOf(val) == -1  )			
				{
				alert(val + ' not in list of Accounts')	
				angular.element(event.target).val("")
				return
				}//if
				scope.$apply(function(){
					ngModel.$setViewValue(val)
				})				
				})//autocompletechange callback		
		})//success
		}//link
	}//return
	}])//directive

