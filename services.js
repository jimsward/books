/* The EntriesDAO must be constructed with a connected database object */
function ServicesDAO(db) {
    "use strict";

    /* If this constructor is called without the "new" operator, "this" points
     * to the global object. Log a warning and call it correctly. */
    if (false === (this instanceof ServicesDAO)) {
        console.log('Warning: ServicesDAO constructor called without "new" operator');
        return new ServicesDAO(db);
    }

    var services = db.collection("services");

   this.getList = function( callback )
   {
	   services.find( {} ).sort( { service : 1 } ).toArray( function( err, items)
	   {
		   if (err) return callback(err, null);
		   callback(null, items);
		   })
   }

   
}

module.exports.ServicesDAO = ServicesDAO;
