module.exports = {
	process:function(object,field,next){
		// console.log(">>>>"+require('util').inspect(object));
		if (!object) return next("Object is null");
		if (typeof(object[field]) == "function"){
			next(undefined,(object[field])());
		} else {
			// console.log(">>>>"+require('util').inspect(object[field]));
			next(undefined,object[field]);
		}
	}
}