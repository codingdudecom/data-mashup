module.exports = {
	process:function(object1,object2,next){
		next(undefined,this.extend({},object1,object2));
	},
	extend:function(target) {
	    var sources = [].slice.call(arguments, 1);
	    sources.forEach(function (source) {
	        for (var prop in source) {
	            target[prop] = source[prop];
	        }
	    });
	    return target;
	}
}