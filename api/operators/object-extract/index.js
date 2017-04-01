module.exports = {
	process:function(object,field,next){
		// console.log(">>>>"+require('util').inspect(object));
		if (!object) return next("Object is null");

		if (field.indexOf(".")>=0){
			next(undefined,this.deep_value(object,field));
		} else if (typeof(object[field]) == "function"){
			next(undefined,(object[field])());
		} else {
			// console.log(">>>>"+require('util').inspect(object[field]));
			next(undefined,object[field]);
		}
	},
	deep_value:function(obj, path){
	    for (var i=0, path=path.split('.'), len=path.length; i<len; i++){
	    	if (typeof(obj[path[i]]) == "function"){
	    		obj = (obj[path[i]])();
	    	}else{
		        obj = obj[path[i]];
		    }
	    };
	    return obj;
	}
}