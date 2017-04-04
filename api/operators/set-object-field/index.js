module.exports = {
	process:function(object,field,value,next){
		if (!object) object = {};
		object[field] = value;
		next(undefined,object);
	}
}