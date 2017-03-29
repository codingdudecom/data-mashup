module.exports = {
	process:function(input,next){
		console.log(">>>>>>>>"+JSON.stringify(arguments));
		next(undefined,input);
	}
}