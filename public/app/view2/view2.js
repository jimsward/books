'use strict';

var app = angular.module('myApp.view2', ['ngRoute'])

app.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view2', {
    templateUrl: 'view2/view2.html',
    controller: 'View2Ctrl'
  });
}])
app.controller('View2Ctrl', ['$scope', 'getCustomers', '$http', '$location', function($scope, getCustomers, $http, $location){		
	getCustomers.then(function(response) {		
	$scope.customers = response.data
	//user clicked on a customer x in the list; redirect to customer details page with customer x's document
	$scope.customerDetails = function(customer){
					$location.path('/customer').search(customer);
		}
		})//then	
	}//callback
	
]);//controller
app.factory( 'getCustomers', [ '$http', function($http) {	 
    return $http.get('/customers')	
	}])	
app.directive('listcustomers', [ '$location', '$http', 'getCustomers', function( $location, $http, getCustomers ){		
	return {
		require : 'ngModel',
	link : function(scope,element,attrs, ngModel){
		getCustomers.then(function(response) {
		if (response)
		{	
		var cusArr = []
	angular.forEach( response.data, function(value, key){
		//console.log(value + '  ' + key)
		cusArr.push( value.name )}	)
				
		element.autocomplete({
  				    source : cusArr								
					})
					.keypress( "autocompleteselect", function(event){
          if (event.keyCode === 13) 
          {					
				var val = element.val()
				var i = cusArr.indexOf(val)
				if ( i > -1 )
				{
				scope.$apply(function(){
				ngModel.$setViewValue(val)					
				var param = response.data[i]
				//console.log(param)
				$location.path('/customer').search(param);
				})
				}
				else
				{
					scope.$apply(function(){
					ngModel.$setViewValue('')})
					alert( 'Name is not in Customer List' )
				}				
		 }				
		})//keypress handler
		}
		})//then
		
		}//callback
	}//return
}]);
