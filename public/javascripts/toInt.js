

module.exports = function(string)	//returns an integer with the string's value * 100
		{
		if (string=='') return 0;
										//ie 5.00 returns 500
		var decArr = new Array
		var dotFree
		var re = /\,/g		
		decArr = string.split('.')
		dotFree = decArr[0] + decArr[1]	
		dotFree = dotFree.replace( re, '' )
		return parseInt(dotFree)
											
		
		}