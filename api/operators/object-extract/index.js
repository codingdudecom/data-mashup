module.exports = {
	process:function(object,field,next){
		var self = this;
		// console.log(">>>>"+require('util').inspect(object));
		if (!object) return next("Object is null");

		if (typeof(field) == "string"){
			if (field.indexOf(".")>=0){
				next(undefined,this.deep_value(object,field));
			} else if (typeof(object[field]) == "function"){
				next(undefined,(object[field])());
			} else {
				// console.log(">>>>"+require('util').inspect(object[field]));
				next(undefined,object[field]);
			}
		} else if (typeof(field) == "object"){
			
			var output = {};
			_.each(Object.keys(field),function(source){
				var dest = field[source];
				self.process(object,source,function(err,value){
					if (err) throw(err);
					output[dest] = value;
				});
			});
			debugger;
			next(undefined,output);
		} else {
			next("field must be either string or object");
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