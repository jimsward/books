'use strict';

var app = angular.module('myApp.view4', ['ngRoute'])

app.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view4', {
    templateUrl: 'view4/view4.html',
    controller: 'View4Ctrl'
  });
}])
//Invoice entry. Adds invoice info and total to invoices collection. Adds line items -invArr- to transactions collection.
//or show an existing invoice
app.controller('View4Ctrl', ['$scope', '$window','$http', '$routeParams', '$location', '$filter', 'addInvoice', function($scope, $window, $http, $routeParams, $location, $filter, addInvoice){
	//if the page request has parameters, user wants to see an existing invoice
	if ( $routeParams.number )
	{
	$scope.invoice = {}
	$scope.invoice.address = $routeParams.address	
	$scope.invoice.name = $routeParams.name	
	$scope.invoice.number = $routeParams.number
	$scope.invoice.date = $routeParams.date
	var invNum = parseInt( $scope.invoice.number )
	var inv= { number : invNum }
	$http({ url : '/invoice', method : 'GET', params : inv }).success( function(response){
	$scope.invoice = response
	//$scope.invoice.lines.amount = $filter('currency')( $scope.invoice.lines.amount )
	//$scope.invoice.lines[0].amount = $filter('currency')( 77, "", 2 )
	//$( 'table#invtbl tr td input#invamt' ).remove()
			} )
	}
	//add a new invoice
	else {
	$scope.invoice = {}	
	$scope.invoice.lines = [ { activity : "", memo : "", amount : "" } ]
	$scope.invoice.total = 0
	var today = new Date()
	$scope.invoice.date = $filter('date')(today, "MM/dd/yyyy")	
	$scope.invoice.type = "Invoice"	
	}	
	$scope.cancelInvoice = function(){
		$location.path('/view2')
		}
	$scope.printInvoice = function(){
		$(".menu").add('p').add('button').hide()
		$window.print();
		$(".menu").add('p').add('button').show()
	}
	$scope.saveInvoice = function(){
		if ( $scope.invoice.name == null )
		alert( 'Enter a customer name' )
		else
		if ( $scope.invoice.number == null )
		alert( 'Enter a number to continue' )
		else
		if ( $scope.invoice.total == 0 )
		alert( 'Please enter an amount' )
		else
		{	
		$scope.invoice.total = 	$filter('currency')( $scope.invoice.total, "", 2 )	
		var length =  $scope.invoice.lines.length
		if ( $scope.invoice.lines[length - 1].amount == 0 )//if the last line item is empty get rid of it
		$scope.invoice.lines.pop()
			
		addInvoice($scope.invoice)
		$scope.invoice = {}
		$scope.invoice.total = 0
		$scope.invoice.lines = [ { activity : "", memo : "", amount : 0 } ]
		alert('Invoice added')
		}
		}
		
	
	$scope.tabfwd = function( event ){			
		if (event.which == 9)
		{	
		var num = angular.element(event.target).val()	
		var re = /\,/g		
		num = num.replace(re, "")
		num = parseFloat(num)
		$scope.invoice.total += num
		$scope.invoice.lines.push( { activity : "", memo : "", amount : 0 } )
		}
	}
	
	
	
}])
app.factory( 'addInvoice', [ '$http', function($http) {		 
    return function(invoice){
	$http.post('/newInvoice', invoice).success( function(){
		
	console.log('success')
			} )
	}	
	}])
app.directive('listservices', [ '$http', function($http){	
	return {
	require : 'ngModel',
	link : function(scope,element,attrs, ngModel){
		 var services = new Array		 				
		$http( {
    	url: '/services',
   	 	method: "GET"}		 
		)
		.success( function(msg){
			angular.forEach(msg, function( value, key){
			services[key] = value.service;
			})	
			element.autocomplete({
  				    source: services					
					})
			element.on( "autocompletechange", function(event, ui){
				var val = event.target.value
				console.log(services.indexOf(val))				
				if (services.indexOf(val) == -1 && val.length > 0 )			
				{
				alert(val + ' not in list of Services')	
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
/*app.directive('filtercur', [ '$filter', function( $filter ){
	return {
	link : function(scope,element,attrs, ngModel){
		element.remove( 'maskmoney' )
		angular.forEach(scope.invoice.lines, function(value, key){ 
		value.amount = $filter('currency')( value.amount, "", 2 ) 
		})
		}
	}
	}])*/
	app.directive('stringToNumber', function($timeout) {
  return {
    require: 'ngModel',
    link: function(scope, element, attrs, ngModel) {
      ngModel.$parsers.push(function(value) {
        return '' + value;
      });
      ngModel.$formatters.push(function(value) {
        return parseFloat(value, 10);
      });	 
    }
  };
});
