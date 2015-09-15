/* The EntriesDAO must be constructed with a connected database object */
function TransactionsDAO(db) {
    "use strict";

    /* If this constructor is called without the "new" operator, "this" points
     * to the global object. Log a warning and call it correctly. */
    if (false === (this instanceof TransactionsDAO)) {
        console.log('Warning: TransactionsDAO constructor called without "new" operator');
        return new TransactionsDAO(db);
    }

    var transactions = db.collection("transactions");
	this.addTransaction = function( obj, callback ){
		transactions.insert( obj, function( err, doc ){
			if (err) return callback( err, null )
			return callback( null, doc )
			} )
		}
	this.getList = function( callback ){
		
		transactions.find( {} ).limit(10000).toArray( function( err, items ){
			
			if (err) return callback( err, null )
			return callback( null, items )
			} )
		}
}

module.exports.TransactionsDAO = TransactionsDAO;
