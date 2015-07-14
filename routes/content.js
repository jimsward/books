 var qs = require('querystring');
var EntriesDAO = require('../entries').EntriesDAO
var AccountsDAO = require('../accounts').AccountsDAO
var toDecimal = require('../public/javascripts/toDecimal')
var toInt = require('../public/javascripts/toInt')

  //, sanitize = require('validator').sanitize; // Helper to sanitize form input

/* The ContentHandler must be constructed with a connected db */
function ContentHandler (app, db) {
    var displArr
    var entries = new EntriesDAO(db);
	var accounts = new AccountsDAO(db);
	
	this.displayLayout = function(req, res, next){
	return res.redirect( 'app/index.html' )}

    this.displayMainPage = function(req, res, next) {
        "use strict";

        entries.getEntries( function(err, results) {	
			
            "use strict";
			 if (err) return next(err);
			 
			 

			
			for ( var i = 0; i < results.length; i++ )
			{ 
			if ( results[i].deposit== 0 ){
				 results[i].deposit = "";
				 results[i].payment = toDecimal(results[i].payment)
			}
			
			else{
				results[i].payment = "";
				results[i].deposit = toDecimal(results[i].deposit)
			}
			results[i].balance = toDecimal(results[i].balance)
			results[i].id = i.toString()
			
			var parts = results[i].date.split('/');
			results[i].date = parts[1] + '/' + parts[2] + '/' + parts[0]
						
			}
			
			var displArr = results.slice( results.length - 40 )
			app.locals.entry = { "items" : displArr }
			
			
			
           /* return res.render('entries', { items : displArr, username : req.username  } );*/
		   return res.send( app.locals.entry )
        });
    }



	this.handleNewEntry = function(req, res, next) {
		
		console.dir('req.body: ' + req.body.account)
		var newE = req.body;  //need to store dollar amounts as integers
		newE.deposit = toInt( newE.deposit )
		newE.payment = toInt( newE.payment )
				
		var parts = newE.date.split('-');
		
		newE.date =  parts[0] + '/' + parts[1] + '/' + parts[2] 		
		
			entries.insertEntry( newE, function(err) {
            "use strict";
            if (err) return next(err);

            entries.getEntries(function(err, results) {	
			 "use strict";
			 if (err) return next(err);
			 
			//to reduce clutter, no display of zero amounts
			for ( var i = 0; i < results.length; i++ )
			{ 
			if ( results[i].deposit== 0 ) results[i].deposit = "";
			if ( results[i].payment == 0 ) results[i].payment = "";
			}
			
			var entry = { "items" : results }			
           // return res.render('entries', entry );
		   return res.send( entry )
        });			
		})
	}
	

				
	this.deleteRow = function(req, res, next) 
	{
		var obj = req.body			
		entries.deleteEntry(obj, function(err, results){
			if (err) return next(err);
		
			return res.end()			
			})		
	}
	
	
	this.findRow = function( req, res, next )
	{
			
	var obj = req.query
		entries.findEntries(obj, function(err, results)
		{
			//console.log(results)
			for ( var i=0; i<results.length; i++ )
			{
			var parts = results[i].date.split('/');
			results[i].date = parts[1] + '/' + parts[2] + '/' + parts[0]
			if ( results[i].deposit== 0 ){
				 results[i].deposit = "";
				 results[i].payment = toDecimal(results[i].payment)
			}			
			else{
				results[i].payment = "";
				results[i].deposit = toDecimal(results[i].deposit)
			}
			}
			return res.send(results)
			})
		}


	this.listAccounts = function( req, res, next )
	{
		accounts.getList( function(err, results)
		{
			return res.send(results)
		})
	}
	
	
	this.chkUpdate = function( req, res, next ){		
		var obj = req.body		
		var re = /\,/g
		obj.deposit = req.body.deposit.replace( re, ''  )				
		obj.payment = req.body.payment.replace( re, ''  )
		obj.deposit = parseInt((obj.deposit*100))
		obj.payment = parseInt((obj.payment*100))
		var parts = obj.date.split('/');
			obj.date = parts[2] + '/' + parts[0] + '/' + parts[1]
		console.log(obj.deposit + '  ' + obj.payment)

		
		entries.updateEntry( obj, function(err, results)
		{
			
		if (err) return next(err)
		console.log(results)		
		return res.end()
		})	
	}
}

module.exports = ContentHandler;
