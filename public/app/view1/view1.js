'use strict';
var app = angular.module('myApp.view1', ['ngRoute'])
app.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl'
  });
}])
//Populate the table with checkbook entries
app.controller('View1Ctrl', [ '$scope', 'getEntries', '$http', function($scope, getEntries, $http){	
	
	getEntries.then(function(response) {		
	$scope.items = response.data.items
	
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
	})//promise	
	}])//controller
app.factory( 'getEntries', [ '$http', function($http) {	 
    return $http.get('/entries')	
	}])
	//form with controls for new entries to the check register
app.controller('entryFormCtl', ['$scope', '$http', function($scope, $http){
	$scope.entry = {}	
	var myDate = new Date();
	var imonth = myDate.getMonth()+1
	if ( imonth < 10 ) imonth = '0' + imonth	
	var today =( myDate.getFullYear() + '-' + imonth  + '-' + myDate.getDate())
	$scope.entry.date = today
	angular.element( '#datepicker' ).focus()
	$scope.entry.payment = 0
	$scope.entry.deposit = 0
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
		else		
		$http.post('/newentry', $scope.entry).then( function(){
		location.reload(true)})
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
	}])	//schRegDialog controller
app.directive('datepicker', function(){	      
	return {
	require: 'ngModel',
	link : function(scope,element,attrs, ngModel){
		element.datepicker({
				onSelect: function(dateText) {
				  scope.$apply(function() {
					ngModel.$setViewValue(dateText);
				  });
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
		.success( function(msg){
			angular.forEach(msg, function( value, key){
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
		.success(  function(data){			
		alert('Document Updated!')
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
		//alert( scope.obj.key + ' ' + scope.obj.val )
		scope.$apply( function() {			
		$http( {
    	url: '../find',
   	 	method: "GET",
    	params: scope.obj } )
		.success(  function(data){			
		scope.results = data
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
		.success(  function(data){			
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
		.success(  function(data){			
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
		.success(  function(data){			
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