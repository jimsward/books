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
app.controller('View4Ctrl', ['$scope', '$window','$http', '$routeParams', '$location', '$filter', 'addInvoice', 'getInvoice', function($scope, $window, $http, $routeParams, $location, $filter, addInvoice, getInvoice){
	//if the page request has parameters, user wants to see an existing invoice
	if ( $routeParams.number )
	{
	$scope.saved = true //don't need to save before printing
	$scope.invoice = {}

	$scope.invoice.number = $routeParams.number

	var invNum = parseInt( $scope.invoice.number )
	var inv= { number : invNum }
	$http({ url : '/invoice', method : 'GET', params : inv }).success( function(response){
	$scope.invoice = response
	$scope.invoice.address = $routeParams.address
	//$scope.invoice.lines.amount = $filter('currency')( $scope.invoice.lines.amount )
	//$scope.invoice.lines[0].amount = $filter('currency')( 77, "", 2 )
	//$( 'table#invtbl tr td input#invamt' ).remove()
			} )
	}
	//add a new invoice
	else {
	$scope.saved = false
	$scope.invoice = {}
		if ($routeParams.name)
		{
			$scope.invoice.name = $routeParams.name
			$scope.invoice.address = $routeParams.address
		}
	$scope.invoice.lines = [ { activity : "", memo : "", amount : "" } ]
	$scope.invoice.total = 0
	var today = new Date()
	$scope.invoice.date = $filter('date')(today, "MM/dd/yyyy")	
	$scope.invoice.type = "Invoice"	
	}	
	$scope.cancelInvoice = function(){
		$location.path('/view2')
		}
	$scope.printInvoice = function(event){
		$(".menu").add('p').add('button').hide()
		var number = {number : $scope.invoice.number}
			var promise = getInvoice.getInv(number)
			promise.then(
			function successCallback(response){
				$scope.invoice = response.data
				$window.print();
				$(".menu").add('p').add('button').show()
			}, function errorCallback(response){
				alert('error' +	response.error)
			}
		)
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
		$scope.saved = true
		console.log('Invoice added')
		}
		}
	$scope.tabfwd = function( event ){
		var accept = [ 9, 46, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57 ]	//dot, tab, and 0-9
		if ( accept.indexOf( event.which ) == -1 ) return
		if (event.which == 9)
		{
		var re = /(\d+)\.*(\d*)/
		var val = angular.element( event.target ).val()
		if (isNaN(val))
		{
			 angular.element( event.target ).val("")
			 return
		}

		if (re.test(val))
		{
		var num = angular.element(event.target).val()
		num = $filter('number')(num, 2)
		angular.element(event.target).val(num )
		var re = /\,/g
		var totnum = num
		totnum = totnum.replace(re, "")

		totnum = parseFloat(totnum)
		$scope.invoice.total += totnum
		$scope.invoice.lines.push( { activity : "", memo : "", amount : 0 } )
		}
		else
		{
		angular.element(event.target).val( "" ).focus()
		}//else
		}//if
	}
	$scope.custdetails = function(){
		$scope.invoice.name = $('#custinvoice').val()
		//alert('name : ' + $scope.invoice.name)
		var params = {name : $scope.invoice.name }
		$http( { url :'/customer', params : params, method : 'GET' } ).then(function(response){
			console.log(response.data)
			$scope.invoice.address = response.data.address
		})

	}
}])
app.factory( 'addInvoice', [ '$http', function($http) {
    return function(invoice){
	$http.post('/newInvoice', invoice).success( function(){
				} )
	}
	}])
app.factory( 'getInvoice', [ '$http', function($http) {
	return {
		getInv : function(number) {
			return	$http({method: 'GET', url: '/invoice', params: number})
		}
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


