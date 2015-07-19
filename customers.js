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

   
}

module.exports.CustomersDAO = CustomersDAO;
