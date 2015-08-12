'use strict';

var app = angular.module('myApp.view3', ['ngRoute'])

app.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view3', {
    templateUrl: 'view3/view3.html',
    controller: 'View3Ctrl'
  });
}])
app.controller('View3Ctrl', ['$scope', '$routeParams','$http', '$timeout', function($scope, $routeParams, $http, $timeout){	
	$scope.customer = $routeParams	
	console.log($scope.customer)
	angular.element( '#tabs' ).tabs()
	if ( $scope.customer.name == 'NEW' ){
		$timeout(function(){
		angular.element('#new-customer').trigger('click')},
		100)
	}
	else
	{
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
			})
	}
	$scope.openNewCustomer = function(){
		console.log('button')
		$scope.customer = {}
		$scope.customer.entries = []
		$scope.customer.invoices = []
		$scope.dialog.dialog( "open" )
		}
	$scope.openEdit = function(){
		$scope.dialog.dialog( "open" )
		}

}]);//controller

	
app.directive( 'newcustdialog', [ '$http', '$location', function($http, $location){	      
	return {
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
		  scope.customer.entries = []
		  scope.customer.invoices = []
		  var params = scope.customer
		  console.log(params)
		  $http( {
		url : '/customerUpdate',
		method : 'POST',
		data : params
		} ).then
		( function( response ){
			$( "#newCustomer" )[0].reset()
			console.log($(this))
		  $(this).dialog( "close" );
			} )
		  
		  }
	 },
	  {text : 'Cancel',
	  id : 'custDialogCancel',
	  click: function() {
		  $( "#newCustomer" )[0].reset()
		  $(this).dialog( "close" );
		  }
	  }
	 
		]
		})
		}//link
	
		}//return
		} ] )//directive
