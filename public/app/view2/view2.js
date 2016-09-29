'use strict';

var app = angular.module('myApp.view2', ['ngRoute'])

app.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view2', {
    templateUrl: 'view2/view2.html',
    controller: 'view2Ctrl'
  });
}])
app.controller('view2Ctrl', ['$scope', 'getCustomers', 'customerInit', '$http', '$location', function($scope, getCustomers, customerInit, $http, $location){
	$scope.gotCustomer = false
	getCustomers.then(function(response) {
		$scope.customers = response.data
	})
	//user clicked on a customer x in the list; redirect to customer details page with customer x's document
	$scope.customerDetails = function(event, customer){
		event.stopPropagation()
		$location.path('/customer').search(customer);
		}
		$scope.openNewCustomer = function(){
		$scope.customer = customerInit
		$scope.dialog.dialog( "open" )
		}
	$scope.createInvoice = function(){
		$location.path('/invoice')
		} 
	$scope.custdetails = function(){
		$scope.customer.name = $('#customername').val()
		$location.path('/customer').search($scope.customer);
		}
	$scope.makeInvoice = function(event, customer){
		event.stopPropagation()
		console.log(customer.name)
		$location.path('/invoice').search(customer);
	}
	}]);//controller
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
	link : function(scope, element, attrs, ngModel){
		getCustomers.then(function(response) {
			if (response) {
				var cusArr = []
				angular.forEach(response.data, function (value, key) {
						cusArr.push(value.name)
					}
				)
				element.autocomplete({
					source: cusArr
				})
				element.on( "autocompleteclose", function(event, ui){
					var val = event.target.value
					if (cusArr.indexOf(val) == -1 && val.length > 0 )
					{
						alert(val + ' not in list of Customers')
						angular.element(event.target).val("")
						return
					}//if
					console.log('This is it')
					//$('#findcust').focus()
					scope.$apply(function(){
						ngModel.$setViewValue(val)
						scope.custdetails()

					})

				})//autocompletechange callback

			}
		})
	}
	}

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
	  /*focus : function(event, ui){
		  $( "[id^=custDialog]").attr( "class", "btn btn-info").attr( "disabled", !scope.user )
		  },*/
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
			  alert( 'Please enter a name and an address!' )
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
 
