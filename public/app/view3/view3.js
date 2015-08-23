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
	//$( '#tabs' ).tabs()
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
	$scope.openEdit = function(){
		$scope.dialog.dialog( "open" )
		}
}]);//controller
app.directive( 'tabs', function(){
	return {
		link : function(scope, element, attrs){
			element.tabs()
			}		
		}
	} )	
app.directive( 'custedit', [ '$http', '$location', function($http, $location){	      
	return {		
	link : function(scope,element,attrs, ngModel){		
	scope.dialog = $( "#edit-customer-form" ).dialog({
      autoOpen: false,
      height: 600,
      width: 1040,
      modal: true,
	  open: function( event, ui ) {console.log('OPEN')},
	  close : function(){
		  $location.path('/customers')
		  },
    buttons: [  //button label/text : callback
	 {text : 'Save',
	  id : 'custDialogSave',
	  click: function() {		  
		var params = scope.customer
		  console.log(params)
		$http( {
		url : "/customerUpdate",
		method : 'POST',
		data : params
		} ).success
		( function( response ){
			console.log(response)
			$( "#editCustomer" )[0].reset()
			console.log('this : ' + $(this))
			element.dialog( "close" );
			} )
		  }		 
	 },
	  {text : 'Cancel',
	  id : 'custDialogCancel',
	  click: function() {
		  $( "#editCustomer" )[0].reset()
		  $(this).dialog( "close" );
		  }
	  },
	  {text : 'Reset',
	  id : 'custDialogReset',
	  click: function() {
		  console.log('the reset button')
		  $( "#editCustomer" )[0].reset()
		  }	  
	  }	 
		]
		})
		}//link
		}//return
		} ] )//directive

