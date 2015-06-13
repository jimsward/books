

module.exports = function(number)	//returns a string with the (integer) number divided by 100
{									//and commas thus: ###,###,###,###.##
		var str = number.toString()
		var part1 = str.substring(0, str.length - 2)
		if (part1.length >3)
		{
			
			part1 = part1.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
					}
		var part2 = str.substring(str.length - 2)
		var result = part1 + '.' + part2;
		return result

	}