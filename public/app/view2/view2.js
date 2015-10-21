'use strict';

var app = angular.module('myApp.view2', ['ngRoute'])

app.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view2', {
    templateUrl: 'view2/view2.html',
    controller: 'View2Ctrl'
  });
}])
app.controller('View2Ctrl', ['$scope', 'getCustomers', 'customerInit', '$http', '$location', function($scope, getCustomers, customerInit, $http, $location){		
	getCustomers.then(function(response) {		
	$scope.customers = response.data
	
	//user clicked on a customer x in the list; redirect to customer details page with customer x's document
	$scope.customerDetails = function(customer){
		
					$location.path('/customer').search(customer);
		}
		})//then
		
	$scope.openNewCustomer = function(){
		$scope.customer = customerInit
		$scope.dialog.dialog( "open" )
		}
	$scope.createInvoice = function(){
		$location.path('/invoice')
		} 
	}//callback
]);//controller
app.factory( 'getCustomers', [ '$http', function($http) {	 
    return $http.get('/customers')	
	}])
app.factory( 'customerInit', [ '$http', function($http) {	 
    var customer = {}
	customer.entries = []
	customer.invoices = []
	customer.name = ''
	customer.company = ''
	customer.address = ''
	customer.phone = ''
	customer.email = ''
	customer.balance = 0
	return customer	
	}])
	
app.directive('listcustomers', [ '$location', '$http', 'getCustomers', function( $location, $http, getCustomers ){		
	return {
		require : 'ngModel',
	link : function(scope,element,attrs, ngModel){
		getCustomers.then(function(response) {
		if (response)
		{	
		var cusArr = []
		var addressArr = []//kluge
	angular.forEach( response.data, function(value, key){		
		cusArr.push( value.name )
		addressArr.push( value.address )
		
		}		
			)				
		element.autocomplete({
  				    source : cusArr								
					})
					.keypress( "autocompletechange", function(event){
          if (event.keyCode === 13) 
          {					
				var val = element.val()
				var i = cusArr.indexOf(val)				 
				if ( i > -1 )
				{
				scope.$apply(function(){
				ngModel.$setViewValue(val)})					
				var param = response.data[i]
				if ( attrs.id == "customername" )//retrieving customer document
				{
				$location.path('/customer').search(param);
				}
				else
				{
				//we are creating an invoice
				scope.invoice.name = response.data[i].name
				scope.invoice.address = response.data[i].address
				}
		
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
 app.directive( 'custdialog', [ '$http', '$location', 'customerInit', function($http, $location, customerInit){	      
	return {
	/*templateUrl: "custDetailsDialog.html",*/
	link : function(scope,element,attrs, ngModel){
		 scope.dialog = $( "#new-customer-form" ).dialog({
      autoOpen: false,
      height: 600,
      width: 1040,
      modal: true,
	  close : function(){
		  $location.path('/customers')
		  },
    buttons: [  //button label/text : callback
	 {text : 'Save',
	  id : 'custDialogSave',
	  click: function() {		  
		  if ( scope.customer.name && scope.customer.address )
		  {
		  var params = scope.customer
		  $http( {
		url : "/newCustomer",
		method : 'POST',
		data : params
		} ).success
		( function( response ){
			element.dialog( "close" );
			})
			
		  }
		  else
		  {
			 // alert( 'Please enter a name and an address!' )
		  }
		  }
	 },
	  {text : 'Cancel',
	  id : 'custDialogCancel',
	  click: function() {
		  $( "#newCustomer" )[0].reset()
		  $(this).dialog( "close" );
		  }
	  },
	  {text : 'Reset',
	  id : 'custDialogReset',
	  click: function() {
		  $( "#newCustomer" )[0].reset()
		  }	  
	  }	 
		]
		})
		}//link
		}//return
		} ] )//directive
 
