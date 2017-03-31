module.exports = {
	process:function(input,next){
		if (typeof(input) == 'object'){
			console.log(require('util').inspect(input));
		} else {
			console.log(input);
		}
		next(undefined,input);
	}
}