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
 * description Controller for the table of check entries and dialog, chkEntryDlg, that pops up on clicks on a table row.
 * Although it is called 'view1Ctrl', it ends there. There are 2 more controllers on this partial
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
		$scope.username = response.data.username
		$rootScope.user = $scope.username ? true : false
	})

	$scope.login = function(){
		$location.path('/view6')
		}
	$scope.signUp = function(){
		$location.path('/view7')
		}
	$scope.logout = function(){		
		$http.get( '/logout' ).then( function(response){
			$scope.user = false
			} )
		}
	$scope.openForm = function(item){
		$rootScope.selected = item
		$('tr#' + item.id).replaceWith($compile("<entry-form />")($scope));
	}
	$scope.openDlg =  function(item){
		angular.element( '#' + item.id ).unbind().css( 'opacity', '0.5' )
		$scope.item = item
				
		$scope.$watch('item.payment', function(){
			if ( $scope.item.deposit > 0 && $scope.item.payment > 0 )
			{ $scope.item.deposit = '0' }
		})
		$scope.$watch('item.deposit', function(){
			if ( $scope.item.deposit > 0 && $scope.item.payment > 0 )
			{ $scope.item.payment = '0' }			
		})
		$scope.clearAmt = function(which){//mousedown handler			
			which == 'payment' ? $scope.item.payment = 0 : $scope.item.deposit = 0
			}		
	$scope.dialog.dialog( "open" )
		}			
		
	}])//controller
app.factory( 'getEntries', [ '$http', function($http) {	 
    return $http({url : '/entries', method : 'GET'})
	}])
	//form with controls for new entries to the check register

app.factory('addEntry', ['$http', function($http) {
	return {
		newEnt: function (data) {
			return $http({url: '/newentry', data: data, method: "POST"})
		}
	}
}])

app.directive('datepicker', function(){	      
	return {
	require: 'ngModel',
	link : function(scope,element,attrs, ngModel){
		element.datepicker({
				onClose: function(dateText) {
					var re = /(0[1-9]|1[012])\/(0[1-9]|[12][0-9]|3[01])\/(19|20)\d\d/
					if (re.test(dateText))
				  scope.$apply(function() {
					ngModel.$setViewValue(dateText);					
				  });
				  else alert( 'Date must be mm/dd/yyyy' )
				},
				dateFormat: "mm/dd/yy"
			  });	
		}
	}
});
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
			angular.forEach(msg.data, function( value, key){
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
	//dialog with form to choose the key (date, amount, payee, account) to search on
	//followed by the value. Uses key/value pair to get a list of documents
	//a click on an item in the list populates a form with the data from that document
	//the form is editable - update, delete
app.directive('wdialog', [ '$http', function($http){	      
	return {
	link : function(scope,element,attrs, ngModel){
				 
	  scope.dialog = $( "#dialog-form" ).dialog({
      autoOpen: false,
      height: 600,
      width: 1040,
      modal: true,
	  close: function( event, ui ) {
			scope.obj = {}
		  },
	  focus : function(event, ui){
		 $( "[id^=sch]").attr( "class", "btn btn-info").attr( "disabled", !scope.user )
		 },
    buttons: [  //button label/text : callback
	  { 
	  text : 'Update',
	  id : 'schUpdate',
	  click : function()
	  	{
		scope.$apply( function() {			
		$http( {
    	url: '/chkUpdate',
   	 	method: "POST",
    	data : scope.entry } )
		.then(  function(data){
		//alert('Document Updated!')
			})
		})
		}},

      {
	 text : 'Find',
	 id : 'schFind',
	 click: function(){
		 switch (scope.obj.key) {
			 case 'date' :
				 scope.obj.val = scope.date
				 break;
			 case 'amount' :
				 scope.obj.val = scope.amount
				 break;
			 case 'account' :
				 scope.obj.val = scope.account
				 break;
			 case 'payee' :
				 scope.obj.val = scope.payee
				 break;
		 }
		scope.$apply( function() {			
		$http( {
    	url: '../find',
   	 	method: "GET",
    	params: scope.obj } )
		.then(  function(response){
			scope.found = true
		scope.results = response.data
			console.dir(response.data)
		scope.obj.val = ''
			})
		})
	  }},//find
	  { 
	  text : 'Delete',
	  id : 'schDelete',
	  click: function(){
		 var data = {} 
		 data._id = scope.entry._id
		scope.$apply( function() {			
		$http( {
    	url: '/delete',
   	 	method: "POST",
    	data : data } )
		.then(  function(data){
		element.dialog( "close" );			})
		  })		  
	  }},		
      { 
	  text : 'Cancel',
	  id : 'schCancel',
	  click: function() {

		$( 'table#resultTable tbody tr' ).remove()
		$(this).dialog( "close" );
		}}        
		]//buttons
    });//scope.dialog					
		}//link
	}//return
}]);//wdialog
	//click on any of the rows in the table displaying check register entries
	//a dialog with this directive appears with the contents of the clicked row
	//this directive on the chkEntryDlg form allows edits and/or delete on the data 
app.directive( 'editable', [ '$http', function($http){
	return {
		
			link : function(scope,element,attrs, ngModel){
										
			  scope.dialog = $( "#chkEntryDlg" ).dialog({
		      autoOpen: false,
		      height: 600,
	 		  width: 400,
		      modal: true,
		focus : function(event, ui){
			$( "[id^=editable]").attr( "class", "btn btn-info").attr( "disabled", !scope.user )
			},	  
		buttons : [
			{
		text : 'save',
			id : 'editableSave',
			click : function() {
				scope.$apply( function() {			
		$http( {
    	url: '/chkUpdate',
   	 	method: "POST",
    	data : scope.item } )
		.then(  function(data){
		element.dialog( "close" );
			})
				})
				}			
			},
			{
		text : 'delete',
			id : 'editableDelete',
			click : function(){
				 var data = {} 
		  data._id = scope.item._id
		scope.$apply( function() {			
		$http( {
    	url: '/delete',
   	 	method: "POST",
    	data : data } )
		.then(  function(data){
		element.dialog( "close" );
			})
		  })				
				}
			},
			{
		text : 'cancel',
			id : 'editableCancel',
			click : function(){
				$(this).dialog( "close" );
				}
			}			
			]			
				})//dialog
			}//link function
		}//return
	}])//editable
app.directive('stringToNumber', function() {
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
app.directive('numberfilt', [ '$filter', '$timeout', function( $filter, $timeout ){
	return {
		require : '?ngModel',
		priority : 1000,
		link : function( scope, element, attrs, ngModel ){
			   element.on('blur keyup change', function() {
        scope.$evalAsync(read);
      });
      read(); // initialize

      // Write data to the model
      function read() {
        var html = element.val() ;
		html = $filter('number')(html, 2)
        ngModel.$setViewValue(html);
	  }
			
			
			}//link
		}//return
	}])
app.directive('utcParser', function () {

	function link(scope, element, attrs, ngModel) {
		var parser = function (val) {
			val = moment.utc(val).format();
			return val;
		};

		var formatter = function (val) {
			if (!val) {
				return val;
			}
			val = moment(val).toDate();
			return val;
		};

		ngModel.$parsers.unshift(parser);
		ngModel.$formatters.unshift(formatter);
	}

	return {
		require: 'ngModel',
		link: link,
		restrict: 'A'
	}
});