module.exports = function(){
	var chars = []
	for ( var i = 0; i < 8; i++ ){
		var rn = Math.floor(Math.random() * 93) + 33
		var char = String.fromCharCode(rn)
		chars[i] = char
		}
		return chars.join(separator = '')
	}