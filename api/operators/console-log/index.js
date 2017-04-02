module.exports = {
	process:function(input,next){
		if (typeof(input) == 'object'){
			this.log(require('util').inspect(input));
		} else {
			this.log(input);
		}
		next(undefined,input);
	},
	log:function(msg){
		console.log(msg);
		sails.sockets.broadcast("projectStatus","CLIENT_CONSOLE",msg);
	}
}