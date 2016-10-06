
/* The EntriesDAO must be constructed with a connected database object */
function InvoicesDAO(db) {
    "use strict";

    /* If this constructor is called without the "new" operator, "this" points
     * to the global object. Log a warning and call it correctly. */
    if (false === (this instanceof InvoicesDAO)) {
        console.log('Warning: InvoicesDAO constructor called without "new" operator');
        return new EntriesDAO(db);
    }

    var invoices = db.collection("invoices");
	this.addInvoice = function( obj, callback ){
		invoices.insert( obj, function( err, doc ){
			if (err) return callback( err, null )

			return callback( null, doc )
			} )
		}
	this.getInvoice = function( number, callback ){
		console.dir( number)
		invoices.findOne(  number , function( err, item ){

			if (!item)
			{
				var no_such_number_error = new Error("Invoice: " + number + " does not exist")
				no_such_number_error.no_such_number = true
				callback(no_such_number_error, null)
			}

			
			//if (err) return callback( err, null )
			else return callback( null, item )
			} )
		}
}

module.exports.InvoicesDAO = InvoicesDAO;
