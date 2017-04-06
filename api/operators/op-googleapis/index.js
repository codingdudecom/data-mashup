var google = require('googleapis');

module.exports = {
	process:function(input,next){

		if (!input.auth) input.auth = process.env.GOOGLE_API_KEY;
		if (!input.cx) input.cx = process.env.GOOGLE_SEARCH_ENGINE_ID;


		var version = input.version?input.version:'v1';
		var api = (google[input.api])(version);

		var endpoint = this.deep_value(api,input.endpoint);

		(endpoint)(input,function(err,body){
			next(err,body);
		});
	},
	deep_value:function(obj, path){
	    for (var i=0, path=path.split('.'), len=path.length; i<len; i++){
	    	if (typeof(obj[path[i]]) == "function"){
	    		obj = obj[path[i]];
	    	}else{
		        obj = obj[path[i]];
		    }
	    };
	    return obj;
	}	
}