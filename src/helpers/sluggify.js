module.exports = function (input) {
	if(input) {
		var slug = input
			.toLowerCase()
			.replace(/[^\w ]+/g,'')
			.replace(/ +/g,'-');
		return slug;
	}
};