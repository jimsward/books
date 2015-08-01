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

    
}

module.exports.InvoicesDAO = InvoicesDAO;
