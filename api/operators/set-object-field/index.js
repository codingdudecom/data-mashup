module.exports = {
	process:function(object,field,value,next){
		if (!object) object = {};

		try{
			if (field.indexOf(".")>=0){
				this.deep_setter(object,field,value)
			}else{
				object[field] = value;
			}
			next(undefined,object);
		}catch(e){
			console.log(e);
			next(e.toString(),undefined);
		}
	},
	deep_setter:function(obj, path,value){
	    for (var i=0, path=path.split('.'), len=path.length; i<len; i++){
	    	if (i==path.length - 1){
	    		obj[path[i]] = value;
	    	}else{
		        obj = obj[path[i]];
	    	}
	    };
	    return obj;
	}
}