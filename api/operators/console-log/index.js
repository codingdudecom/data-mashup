module.exports = {
	process:function(input,next){
		console.log(input);
		next(input);
	}
}