'use strict';

var app = angular.module('myApp.view2', ['ngRoute'])

app.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view2', {
    templateUrl: 'view2/view2.html',
    controller: 'View2Ctrl'
  });
}])
app.controller('View2Ctrl', ['$scope', 'getCustomers', '$http', function($scope, getCustomers, $http){		
	getCustomers.then(function(response) {		
	$scope.customers = response.data
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
		var cusArr = []
	angular.forEach( response.data, function(value, key){
		cusArr.push( value.name )}	)
		console.log(cusArr[0])		
		element.autocomplete({
  				    source : cusArr								
					})
					.keypress( "autocompleteselect", function(event){
          if (event.keyCode === 13) 
          {					
				var val = element.val()
				scope.$apply(function(){
					ngModel.$setViewValue(val)
					var i = cusArr.indexOf(val)
					
				var param = response.data[i]
				console.log(param)
				//param.name = scope.customer.name
				$location.path('/customer').search(param);	
				})					
		 }				
		})
		})//then
		}//callback
	}//return
}]);
