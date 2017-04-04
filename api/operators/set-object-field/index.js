module.exports = {
	process:function(object,field,value,next){

		if (!object) object = {};

		next(undefined,(object[field] = value));
	}
}