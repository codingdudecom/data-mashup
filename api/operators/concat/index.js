module.exports = {
	process:function(input1, input2, next){
		next(undefined,input1.toString()+input2.toString());
	}
}