
/*Date string is formatted mm/dd/yyyy for the client; yyyy/mm/dd for the server.
Check for current format. Pivot to the other format*/
module.exports = function(string)	
		{
		if (string=='') return 0;
		if ( string.length != 10 ) return 0;
		var parts = []
		parts = string.split( '/' )
		if ( parts[0].length == 4 )
		return parts[1] + '/' + parts[2] + '/' + parts[0]
		else
		return parts[2] + '/' + parts[0] + '/' + parts[1]									
		
		}