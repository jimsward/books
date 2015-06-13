/* The EntriesDAO must be constructed with a connected database object */
function EntriesDAO(db) {
    "use strict";

    /* If this constructor is called without the "new" operator, "this" points
     * to the global object. Log a warning and call it correctly. */
    if (false === (this instanceof EntriesDAO)) {
        console.log('Warning: EntriesDAO constructor called without "new" operator');
        return new EntriesDAO(db);
    }

    var entries = db.collection("entries");

   

    this.getEntries = function(num, callback) {
        "use strict";

        entries.find().sort('date', -1).limit(num).toArray(function(err, items) {
            "use strict";

            if (err) return callback(err, null);

            console.log("Found " + items.length + " entries");

            callback(err, items);
        });
    }

 

   
}

module.exports.PostsDAO = PostsDAO;
