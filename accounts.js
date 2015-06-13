/* The EntriesDAO must be constructed with a connected database object */
function AccountsDAO(db) {
    "use strict";

    /* If this constructor is called without the "new" operator, "this" points
     * to the global object. Log a warning and call it correctly. */
    if (false === (this instanceof AccountsDAO)) {
        console.log('Warning: AccountsDAO constructor called without "new" operator');
        return new EntriesDAO(db);
    }

    var accounts = db.collection("accounts");

   this.getList = function( callback )
   {
	   accounts.find( {} ).sort( { account : 1 } ).toArray( function( err, items)
	   {
		   if (err) return callback(err, null);
		   callback(null, items);
		   })
   }

   
}

module.exports.AccountsDAO = AccountsDAO;
