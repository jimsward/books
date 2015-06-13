jQuery(function(){
	
	
	
	



		
	var myDate = new Date();
	var today =(myDate.getMonth()+1) + '/' + myDate.getDate() + '/' +
        myDate.getFullYear();
	
//	$( document ).tooltip();
	
	var toDecimal = function(number)//returns a string with the (integer) number divided by 100 
	{		
		var str = number.toString()
		var part1 = str.substring(0, str.length - 2)
		if (part1.length >3)
		{
			
			part1 = part1.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
					}
		var part2 = str.substring(str.length - 2)
		var result = part1 + '.' + part2;
		return result
	}
		
	
			
					
			
			//user chooses payment or deposit; allow input to one or the other, not both
			$( 'select#reference' ).on( 'change', function( event )
			{				
				var target = $( event.target );				
				var value = target.val()
							
				if ( value == 'payment')
				{
				$('#payment').attr( {'readonly' : 'false', 'placeholder' : 'payment'} ).text('')
				$('#payment').maskMoney().trigger( 'focus' );
				$( "input[id|='deposit']" ).attr( {'readonly' : 'true', 'placeholder' : ''} ).html( 0 );
				}
				else
				{
				$('#deposit').attr( {'readonly' : 'false', 'placeholder' : 'deposit'} ).text('')	
				$('#deposit').maskMoney().trigger( 'focus' );	
				$( "input[id|='payment']" ).attr( {'readonly' : 'true', 'placeholder' : ''} ).html( 0 );	
				
				}
			})
			
	 
	
		$( 'button.cancel' ).on( 'click', function(event){
			location.reload(true)
			} )
				
			
			
		$( '#entryform' )
        .submit(function( event ) {	
				
		event.preventDefault(); //STOP default action
   			 
		var data = {}		
		data.date = $( "input[id|='datepicker']" ).val() 
		data.reference = $( '#reference option:selected' ).val()
		data.number = $( "input[id|='number']" ).val()
		data.payee = $( "input[id|='payee']" ).val()
		data.memo = $( "input[id|='memo']" ).val()
		data.account = $( "input[id|='account']" ).val()
		
		if ( data.reference == 'deposit' )
		{
			 data.payment = 0;
			 data.deposit = $( event.target.deposit ).val()
		}
		else
		{
		data.payment = $( event.target.payment ).val()
		data.deposit = 0;
		}
		if ( data.deposit == 0 && data.payment == 0 || data.deposit > 0 && data.payment >0 )
		{
			location.reload(true)
		alert("You must enter an amount or a payment; but not both!")
		}
		else
		{ 
		 $.ajax({
		  method: "POST",
		  url: "/newentry",
  		  data: data
		   })
		  .always(function( msg ) {
			location.reload(true)
 		  });//ajax  
		}
      });//entryform submit handler	
	  
	  
	  
	
		$( "#datepicker" ).datepicker( {
      showOn: "button",
      buttonImage: "images/calendar.gif",
      buttonImageOnly: true,
      buttonText: "Select date",
	  dateFormat: "m/d/yy"
	   }  );
	$( '#datepicker' ).attr( 'value', today )
	
	$("#datepicker").blur(function(){
        var val = $(this).val();
        var val1 = Date.parse(val);
        if (isNaN(val1)==true && val!==''){
			$(this).val(today)
           alert("Please enter a valid date!")
        }
        else{
           console.log(val1);
        }
    });


	

	$( '.tbl' ).tablesorter( {
    
    widgets: ["uitheme", "zebra", "print"],
    widgetOptions : {
      zebra : [ "normal-row", "alt-row" ],
	  theme : "blue"
    }
  } )
	
 $('div.print.button').click(function(){
    $('.tbl').trigger('printTable');
  });	
	
	//When user clicks on a row, we will edit it
	$( 'td' ).on( 'click', function(event)
	{
		var target = $( event.target );	
		var parentId = target.parent().attr( 'id' )//need parentId to id the record to send to save/edit/delete
		
		$('td').unbind('click')//disallow clicking on other rows until we're done with this one
			
					
		var x = target.parent().position().left;
		var y = target.parent().position().top;
		var positX = Math.round(x) + 542;
		var positY = Math.round(y) + 23;		
		target.siblings().addBack().fadeTo( "slow", 0.3 )
		console.log(x + ' ' + y)
		var buttons = '<button class="submit" id="save">Save</button>'
		+ '<button class="submit" id="edit">Edit</button>'
		+ '<button class="submit" id="cancel">Cancel</button>'
		+ '<button class="submit" id="delete">Delete</button>'
		
		$( '<div/>' )
		.css( { 'height' : '46px', 'width' : '460px', 'background-color' : 'transparent', 'position' : 'absolute', 'left' : positX + 'px', 'top' : positY + 'px', 'padding': '0 4px' } )		
		.appendTo( '.tbody' )
		.html( buttons )		
		
				
		$( 'button#edit' ).on('click', function(event){//allow editing of payment or deposit field
		
		console.log('this: ' + $(this))
		$(this).unbind('click')
					var depositVal = $( 'tr#' + parentId + ' td.deposit' ).text()
					console.log(depositVal)
			if (depositVal)
			{
			$( 'tr#' + parentId + ' td' ).filter(  '.deposit' )
			.html( '<input type="text" id="editdeposit">' )
			$( '#editdeposit' ).maskMoney().trigger( 'focus' )
			$( 'input#editdeposit' ).on( 'keyup', function(event){
				if ( event.which == 13 )
				{
				newAmount = $( event.target ).val()
				

				
				$( 'button#save' ).css( 'opacity', 1 ).on( 'click', function(event){
					var data = {}
					data.deposit = newAmount
					data.payment = 0
					data.id = parentId
					
					$.ajax(
					{
						url : '/edit',
						method : 'POST',
						data : data
						}
					)
					.fail(function( jqXHR, textStatus, errorThrown ) {
					alert(errorThrown)
					})
					.done(function(){
						location.reload(true)
						//alert('Updated.')
						})//done
					})//ajax
				}//button#save				
				} )//on keyup
			}
			else
			{
			$( 'tr#' + parentId + ' td' ).filter(  '.payment' )
			.html( '<input type="text" id="editpayment">' )
			$( '#editpayment' ).maskMoney().trigger( 'focus' )
			$( 'input#editpayment' ).on( 'keyup', function(event){
				if ( event.which == 13 )
				{
				newAmount = $( event.target ).val()
			
				
				$( 'button#save' ).css( 'opacity', 1 ).on( 'click', function(event){
					var data = {}
					data.deposit = 0
					data.payment = newAmount
					data.id = parentId
					
					$.ajax(
					{
						url : '/edit',
						method : 'POST',
						data : data
						}
					)
					.fail(function( jqXHR, textStatus, errorThrown ) {
					alert(errorThrown)
					})
					.done(function(){
						location.reload(true)
						//alert('Updated.')
						})//done
					})//ajax
				}//button#save				
				} )//on keyup	
			}
				
							
		})//button#edit
		
				
		$( 'button#cancel' ).on('click', function(event){
				location.reload(false)
				
		})
				
		$( 'button#delete' ).on('click', function(event){
				var data = { id : parentId }
				$.ajax({
		  		method: "DELETE",
		  		url: "/delete",
  		 		data: data
		  		})
				.fail(function( jqXHR, textStatus, errorThrown ) {
					alert(errorThrown)
					})
		  		.always(function( msg ) {
			  	alert(msg)
				location.reload(true)
 		  		});//ajax  
		})				
		
	})	
	
	
	var dialog, form;
	
	    dialog = $( "#dialog-form" ).dialog({
      autoOpen: false,
      height: 600,
      width: 1040,
      modal: true,
      buttons: {  //button label : callback
	  	Reset: function()
		{ $( '#dialogForm' )[0].reset()
		$( 'input#datepicker2' ).maskMoney( 'destroy' )
		$( 'table#resultTable caption' ).html( '' )
		 $( 'table#resultTable tbody tr' ).remove()
		 },
        Find: form2,
        Cancel: function() {
          dialog.dialog( "close" );
        }
      },
      close: function() {
		  $(this).dialog( "close" )
        //document.getElementById("#dialogForm").reset();
        //allFields.removeClass( "ui-state-error" );
		
      }
    });//dialog
	
	$( 'select#search' ).on( 'change', function(event){
		var search = $( event.target ).val()
		console.log(search)
		$( 'table#resultTable tbody tr' ).remove()
		 switch (search) {
			 
			 
		 case 'date' :
		  
		 $( "#datepicker2" ).datepicker( {
      showOn: "button",
      buttonImage: "images/calendar.gif",
	  showButtonPanel: true,
      buttonImageOnly: true,
      buttonText: "Select date",
	  dateFormat: "m/d/yy"
	   }  );		 
		 break;
		 
		 case 'amount' :
		 $( 'input#datepicker2.hasDatepicker' ).datepicker('destroy')	 
		 $( 'input#datepicker2' ).maskMoney().unbind( 'click' ).trigger( 'focus' )
		 break;
		 
		 case 'account' :
		  $( '#datepicker2' ).datepicker( 'destroy' )
		  $( 'input#datepicker2' ).maskMoney( 'destroy' )
		 var accounts = new Array
		 var data = {}
		 data.key = "account"
		 data.val = {}
		 
		 $.ajax( 
		 {
			 url : '/accounts',
			 method : 'GET'
		 }
		  )
		  .fail(function( jqXHR, textStatus, errorThrown ) {
					alert(errorThrown)
					})
		  .always(function(msg)
					{
					$.each(msg, function(index, value){
						accounts[index] = value.account;
						})	
					$( "input#datepicker2" ).autocomplete({
  				    source: accounts})							
					})		 
		 break;
		 
		 case 'payee' :
		 $( '#datepicker2' ).datepicker( 'destroy' )
    	  $( 'input#datepicker2' ).maskMoney( 'destroy' )
		 var payees = new Array;
		 var data = {}
		 data.key = "payee"
		 data.val = {}
		 $.ajax(
		 {
			url : '/find',
			method : 'GET' 
			
		 })
		  .fail(function( jqXHR, textStatus, errorThrown ) {
					alert(errorThrown)
					})
					.always(function(msg)
					{
					var test
					$.each(msg, function(index, value)
					{
						
						if ( value.payee )
						{
							
							test =  ( $.inArray( value.payee, payees) == -1 )
							if (test)
							payees.push(value.payee)
						
						}
						
						})
						console.log(payees.length)
					$( "input#datepicker2" ).autocomplete({
  				    source: payees})					
					})
		 
		 break;
	 }			 
		} )
 
   function form2()
   {
    
     console.log( 'search logic goes here' );
	 
	/*Callback for the dialog form handler. Send the key (name of the field to search on)
	and the value to the server.*/
		
		var data = {};
	 	data.key = $( 'select#search option:selected' ).val()
		console.log('key:' + ' ' + data.key)
		
		{data.val = $( "input[id|='datepicker2']" ).val()}
		var tableCaption = data.key + ' : ' + data.val
		$( 'table#resultTable caption' ).html( tableCaption )
		
		console.log(data.key + ' ' + data.val)
				
		$.ajax(
		{
		url : '/find',
		method : "GET",
		data : data
		})
	
		.fail(function( jqXHR, textStatus, errorThrown ) {
					alert(errorThrown)
					})
		  
		  .always(function( msg ) {
					$( '#dialogForm' )[0].reset()
					//set up the table with the documents returned from the search query
					$.each( msg, function( index, obj )
					{
						var date = new Date(obj.date)
						var rtdate = date.getMonth() + 1 + '/' + date.getDate() + '/' + date.getFullYear()
						var amount = toDecimal( obj.payment + obj.deposit )
						var type = obj.payment ? 'Payment' : 'Deposit';
						var row = '<td>' + (index + 1) + '</td><td>' + rtdate + '</td><td>' + type + '</td><td>' + amount + '</td>'
						$( '<tr/>' ).attr( 'id', index ).html( row ).appendTo( 'table#resultTable tbody' )
					})
					
				$( '#resultTable tr td' ).on( 'click', function(event)
				{
					var target = $( event.target );
					var parentId = target.parent().attr( 'id' )
					var data = msg[parentId]
					$.ajax(
					{
					url : '/results',
					method : 'GET',
					data : data,
					context: document.body
					}
					)
					.fail(function( jqXHR, textStatus, errorThrown ) {
					alert(errorThrown)
					})
					.always(function(msg)
					{
						$( '.container' ).html('')
						$( '.container' ).html(msg)
						
						})
					
					console.log('send : ' + msg[parentId].deposit)
					
					})	
			})
	
	  
	
   }
 
    $( "#search-register" ).button().on( "click", function() {
      dialog.dialog( "open" );
    });
	
	$( "#datepicker2" ).datepicker( {
      showOn: "button",
      buttonImage: "images/calendar.gif",
	  showButtonPanel: true,
      buttonImageOnly: true,
      buttonText: "Select date",
	  dateFormat: "m/d/yy"
	   }  );
	   
	   $("input#datepicker2").on('change', function(){
		   if ( $( 'select#search' ).val() == 'date' )
		   {
        var val = $(this).val();
        var val1 = Date.parse(val);
		    if (isNaN(val1)==true){
			$(this).val(today)
           alert("Please enter a valid date!")
        }
		   }
        else{
           console.log(val1);
        }
    });

	
			
})
