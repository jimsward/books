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
	//console.log($scope.items[39])
	
			
	})	
	}])
app.factory( 'getEntries', [ '$http', function($http) {	 
    return $http.get('/')	
	}])	
app.controller('entryFormCtl', ['$scope', '$http', '$filter', function($scope, $http, $filter){
	$scope.entry = {}
	angular.element( '#datepicker' ).focus()
	$scope.entry.date = $filter('date')( new Date(), 'M/d/yyyy' )	
	$scope.entry.payment = 0
	$scope.entry.deposit = 0
	$scope.disablePayment = true
	$scope.disableDeposit = true
	angular.element( '#payment' ).maskMoney()
	angular.element( '#deposit' ).maskMoney()	
	//only allow a payment or a deposit; not both
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
		console.log( typeof val1 )
        if (isNaN(val1)==true && val!==''){
			$scope.entry.date = ""
           alert("Please enter a valid date!")
        }
        else{
           console.log(val1);
        }
	}
	}])	
app.controller('schRegDialog', ['$scope', '$http', '$filter', function($scope, $http, $filter){		
	$scope.openSearch = function(){
		$scope.dialog.dialog( "open" )
		}
	angular.element("input[name|='payment']").maskMoney()
	angular.element("input[name|='deposit']").maskMoney()
	
	
			
	$scope.search = function(){							
	var choice = $scope.setSearch	
	switch (choice) {
		case 'date' :
		
		break;		
		case 'amount' :
		angular.element( 'input#datepicker2.hasDatepicker' ).datepicker('destroy')
		angular.element( '#datepicker2' ).maskMoney()		
		break;		
		case 'account' :
		 $( '#datepicker2' ).datepicker( 'destroy' )
		 $( 'input#datepicker2' ).maskMoney( 'destroy' )		
		break;		
		case 'payee' :
		 $( '#datepicker2' ).datepicker( 'destroy' )
		 $( 'input#datepicker2' ).maskMoney( 'destroy' )		 
		break;		
		}//switch		
	}//$scope.search
	//user clicked on a row in the results table
	$scope.pickRow = function(item){
		$scope.entry = item
		$scope.entry.date = $filter('date')( item.date, 'M/d/yyyy' )
		console.log($scope.entry.payment)
		$scope.disablePayment = true
		$scope.disableDeposit = true
		$scope.entry.deposit == 0 ? $scope.disablePayment = false : $scope.disableDeposit = false
		$scope.entry.payment = $filter('number')( ($scope.entry.payment)/100 , 2)
		$scope.entry.deposit = $filter('number')( ($scope.entry.deposit)/100 , 2)	
		}
	$scope.findValidate = function(){
		
		//var inDate = angular.element( 'input#datepicker2.hasDatepicker' ).val()
		
	
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
				dateFormat: "m/d/yy"
			  });	
		}
	}
});
//Placed on an input element, GETs the list of accounts from db
//and verifies that input is in that list - this is a required field
app.directive('listaccts', function($http){	
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
				scope.entry.account = ""
				return
				}//if
				scope.$apply(function(){
					ngModel.$setViewValue(val)
				})				
				})//autocompletechange callback		
		})//success
		}//link
	}//return
	})//directive
app.directive('wdialog', function($http, $location){	      
	return {
	link : function(scope,element,attrs, ngModel){		 
	  scope.dialog = $( "#dialog-form" ).dialog({
      autoOpen: false,
      height: 600,
      width: 1040,
      modal: true,
    buttons: [  //button label : callback
	  { 
	  text : 'Update',
	  id : 'schUpdate',
	  click : function()
	  	{
			console.log(scope.entry)
		
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
		$( 'input#datepicker2' ).maskMoney( 'destroy' )
		$( 'table#resultTable caption' ).html( '' )
		 $( 'table#resultTable tbody tr' ).remove()
		}},
      {
	 text : 'Find',
	 id : 'schFind',	  
	 click: function(){		
		var obj = {}
		obj.key = angular.element( "select#search option:selected" ).text()
		obj.val = angular.element( "input[name='searchdate']" ).val()
		alert( obj.key + ' ' + obj.val )
		scope.$apply( function() {			
		$http( {
    	url: '../find',
   	 	method: "GET",
    	params: obj } )
		.success(  function(data){			
		scope.results = data
			//	console.log(scope.results)
			})
		})
	  }},//find
	  { 
	  text : 'Delete',
	  id : 'schDelete',
	  click: function(){
		  //console.log('scope.entry : ' + scope.entry._id)
		  var data = {} 
		  data._id = scope.entry._id
		scope.$apply( function() {			
		$http( {
    	url: '/delete',
   	 	method: "POST",
    	data : data } )
		.success(  function(data){			
		alert('Document Deleted!')
			})
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
    });//link					
		}//scope.dialog
	}//return
});//wdialog

app.directive( 'editable', function($http, $location){
	return {
		
			link : function(scope,element,attrs, ngModel){
			element.on('click', function(event){
			var actives = angular.element( 'tr.activeTr' ).length//.activeTr means there is already an active row
			if ( actives ) return
			element.unbind().css( 'opacity', '0.5' ).addClass( 'activeTr' )
						
			/*var target = angular.element( event.target );	
			var x = target.parent().position().left;
			var y = target.parent().position().top;
			var positX = Math.round(x) + 542;
			var positY = Math.round(y) + 23;
			var buttons = '<button class="submit" id="save">Save</button>'
			+ '<button class="submit" id="edit">Edit</button>'
			+ '<button class="submit" id="cancel">Cancel</button>'
			+ '<button class="submit" id="delete">Delete</button>'		*/
			
			/*angular.element( '<div/>' ).css( { 'height' : '46px', 'border' : '1px solid black', 'position' : 'absolute', 'left' : positX + 'px', 'top' : positY + 'px', 'background': '#3868bc' } )
			.appendTo( '.tbody' ).html(buttons)*/
			
			/*angular.element( '.tbody tr.activeTr td.payment' ).maskMoney()*/
			//angular.element( '.tbody tr.activeTr td' ).html('<input type="text"/>')			
			//angular.element('button#save' ).on( 'click', function(event){
			//console.log(event.target)
			
/*			scope.item.reference = angular.element( 'tr.activeTr td.reference' ).text()				
				//validation
				scope.$apply( function() {			
				$http( {
    			url: '/chkUpdate',
   	 			method: "POST",
    			data : scope.item } )
				.success(  function(data){			
				alert('Document Updated!')
				})
				})//apply				
				})//button#save click				*/
		/*angular.element( 'button#edit' ).on( 'click', function(){
			angular.element(element).attr('contentEditable', true)
			})*/
			
			
			//console.log(scope.item)
			//.attr('contentEditable', true)			
				})//click handler
			}//link function
		}//return
	})//editable