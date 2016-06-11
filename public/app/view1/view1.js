'use strict';
var app = angular.module('myApp.view1', ['ngRoute'])
app.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'view1Ctrl'
  });
}])
//Populate the table with checkbook entries
app.controller('view1Ctrl', [ '$scope', 'getEntries', '$http', '$location', '$routeParams', '$route', '$rootScope', function($scope, getEntries, $http, $location, $routeParams, $route, $rootScope){
	var promise = getEntries
	promise.then(function(response){
	$scope.items = response.data.items
		return response
	}).then(function(response){
		$scope.username = response.data.username
		console.log($scope.username)
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
app.controller('entryFormCtl', ['$scope', '$http', '$filter', '$rootScope', 'addEntry', function($scope, $http, $filter, $rootScope, addEntry){
	$scope.entry = {}	
	var myDate = new Date();
	var imonth = myDate.getMonth()+1
	var idate = myDate.getDate()
	if ( imonth < 10 ) imonth = '0' + imonth
	if ( idate < 10 ) idate = '0' + idate		
	var today =(   imonth  + '/' + idate + '/' + myDate.getFullYear())
	$scope.entry.date = today
	
	$scope.filterDate = function(){
	$scope.date = $filter('date')($scope.dt, 'MM/dd/yyyy')
	}
	//angular.element( '#datepicker' ).focus()
	$scope.entry.payment = ''
	$scope.entry.deposit = ''
	$scope.disablePayment = true
	$scope.disableDeposit = true
	$scope.change = function(){
		var ref = angular.element( 'select#reference' ).val()
		if ( ref == 'payment' )
		{ $scope.disablePayment = false
		angular.element( '#deposit' ).css('opacity', 0.5)
		angular.element( '#payment' ).css('opacity', 1)
		$scope.disableDeposit = true
			}
		else
		{$scope.disableDeposit = false
		angular.element( '#payment' ).css('opacity', 0.5)
		angular.element( '#deposit' ).css('opacity', 1)
		$scope.disablePayment = true
		}
		}
	$scope.add = function(){
		//validate
		if ( angular.element( '#reference option:selected' ).val() == '' )
		{
			alert('You must choose Deposit or Payment')
			return
		}
		if ( $scope.entry.account == undefined || $scope.entry.account == '' )		
		{
			angular.element( '#account' ).text('')
			alert('Please choose an Account')			
			return
		}
		if ( ($scope.entry.payment + $scope.entry.deposit) == 0 )		
		{			
			alert('Please enter an Amount')			
			return
		}				
		//else
		var data = $scope.entry
		var promise = addEntry.newEnt(data)
		promise.then( function successCallback(){
		location.reload(true)},
		function errorCallback(response){
			console.log('error' + response.data.error.message)
			}
		)
		}	
	$scope.cancel = function()
		{
		location.reload(false)
		}	
	$scope.validDate = function(){
        var val = $scope.entry.date		
        var val1 = Date.parse(val);		
        if (isNaN(val1)==true && val!==''){
			$scope.entry.date = ""
           alert("Please enter a valid date!")
        }
        else{
           console.log(val1);
        }
	}

	}])
app.factory('addEntry', ['$http', function($http) {
	return {
		newEnt :
		function(data){ return $http( {url : '/newentry', data : data, method : "POST"})
				}
}

}])

	//controller for wdialog directive; launches dialog with search on several fields;allows selction of a single record
	//and allows update, delete
app.controller('schRegDialog', ['$scope', '$http', '$filter', function($scope, $http, $filter){		
	$scope.openSearch = function(){
		$scope.dialog.dialog( "open" )
		}		
	$scope.obj = {}
	$scope.items = [ 'date', 'amount', 'payee', 'account' ]
	$scope.obj.key = $scope.items[0];	
	//user clicked on a row in the results table
	$scope.pickRow = function(item){
		$scope.entry = item
		$scope.entry.date = $filter('date')( item.date, 'M/d/yyyy' )
		$scope.disablePayment = true
		$scope.disableDeposit = true
		$scope.entry.deposit == 0 ? $scope.disablePayment = false : $scope.disableDeposit = false
		}
	$scope.clearAmt = function(which){
			which == 'payment' ? $scope.entry.payment = 0 : $scope.entry.deposit = 0
			}
	$scope.filterAmt = function(){		
		$scope.obj.val = $filter('number')($scope.obj.val, 2)
		}		
	}])	//schRegDialog controller
app.directive('datepicker', function(){	      
	return {
	require: 'ngModel',
	link : function(scope,element,attrs, ngModel){
		element.datepicker({
				onClose: function(dateText) {
					var re = /(0[1-9]|1[012])\/(0[1-9]|[12][0-9]|3[01])\/(19|20)\d\d/
					console.log(re.test(dateText))
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
	 text : 'Reset',
	 id : 'schReset',
	
	 click : function()
		{ $( '#dialogForm' )[0].reset()
		$( '#resultsForm' )[0].reset()
		$( 'input#dialogAmt' ).maskMoney( 'destroy' )
		$( 'table#resultTable caption' ).html( '' )
		 $( 'table#resultTable tbody tr' ).remove()
		 scope.obj.key = ""
		}},
      {
	 text : 'Find',
	 id : 'schFind',
	 click: function(){

		scope.$apply( function() {			
		$http( {
    	url: '../find',
   	 	method: "GET",
    	params: scope.obj } )
		.then(  function(response){
		scope.results = response.data
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
		 $( '#dialogForm' )[0].reset()
		$( '#resultsForm' )[0].reset()
		$( 'input#datepicker2' ).maskMoney( 'destroy' )
		$( 'table#resultTable caption' ).html( '' )
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
				   console.log('eventHandler')
        scope.$evalAsync(read);
      });
      read(); // initialize

      // Write data to the model
      function read() {
        var html = element.val() ;
		html = $filter('number')(html, 2)
		console.log(html )
        ngModel.$setViewValue(html);
	  }
			
			
			}//link
		}//return
	}])
