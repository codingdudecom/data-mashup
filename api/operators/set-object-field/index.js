module.exports = {
	process:function(object,field,value,next){
		if (!object) object = {};

		try{
			object[field] = value;
			next(undefined,object);
		}catch(e){
			console.log(e);
			next(e.toString(),undefined);
		}
	}
}