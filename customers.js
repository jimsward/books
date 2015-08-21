var ObjectID = require('mongodb').ObjectID //need this to turn the serialized _id back to an object for updates
/* The EntriesDAO must be constructed with a connected database object */
function CustomersDAO(db) {
    "use strict";

    /* If this constructor is called without the "new" operator, "this" points
     * to the global object. Log a warning and call it correctly. */
    if (false === (this instanceof CustomersDAO)) {
        console.log('Warning: CustomersDAO constructor called without "new" operator');
        return new EntriesDAO(db);
    }

    var customers = db.collection("customers");

   this.getCustomers = function( callback )
   {
	   customers.find( {} ).sort( { name : 1 } ).toArray( function( err, items)
	   {
		   if (err) return callback(err, null);
		   //console.log(items.length)
		   callback(null, items); 
		   })
   }
   this.getACustomer = function( reqName, callback ){
	   customers.findOne( { name: reqName }, function( err, item ){
		   console.log(item)
   if (err) return callback(err, null)
   callback( null, item )
	   })
   
   }
   this.updateCustomer = function( obj, callback ){
	   console.log('customer update method')
	   var query = {}
	   console.log(obj._id)	  
	   var _id = new ObjectID.createFromHexString(obj._id)			
	   query = { "_id" : _id }
	   console.log(query)
	   delete obj._id
	   customers.update( query, obj, function( err, doc ){
		   if (err) return callback(err, null)
			return callback( null, doc )
		   })   
	   } 
	   
	this.insertCustomer = function( obj, callback ){
		customers.insert( obj, function( err, doc ){
			if (err) return callback( err, null )
			return callback( null, doc )
			} )
		}

   
}

module.exports.CustomersDAO = CustomersDAO;
