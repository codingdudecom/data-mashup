const fs = require('fs')
const path = require('path')

module.exports = {
	getOperators:function(){
		return this.getDirectories(sails.config.paths.operators);
	},
	getOperatorData:function(operatorName){
		var self = this;
		var data = null;
		var modules = this.getDirectories(sails.config.paths.operators);
		if (modules.indexOf(operatorName) >= 0){
			var module = this.getOperatorModule(operatorName);
			var params = this.getParamNames(module.process);
			data = {
		        properties: {
		          title: operatorName,
		          inputs: {
		          },
		          outputs: {
		          	mainOutput:{
		          		label:"Output"
		          	}
		          }
		        }
		      };
			_.each(params,function(paramName,idx){
				if (idx != params.length-1 || paramName != "next"){
					data.properties.inputs[paramName] = {
						label:self.camelCaseToSpace(paramName)
					}
				}
			});
			
		}
		return data;
	},
	getOperatorModule:function(operatorName){
		return require(sails.config.paths.operators+"/"+operatorName);
	},
	getDirectories:function (srcpath) {
	  var dirs = fs.readdirSync(srcpath)
	    .filter(file => fs.statSync(path.join(srcpath, file)).isDirectory());

	  // console.log(require(sails.config.paths.operators+"/"+dirs[0]).process);
	  return dirs;
	},
	getParamNames:function (func) {
		var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
		var ARGUMENT_NAMES = /([^\s,]+)/g;
	  var fnStr = func.toString().replace(STRIP_COMMENTS, '');
	  var result = fnStr.slice(fnStr.indexOf('(')+1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
	  if(result === null)
	     result = [];
	  return result;
	},
	camelCaseToSpace:function(str){
		return str
				.replace(/([A-Z])/g, ' $1')
				.toLowerCase()
				.trim()
	    		.replace(/^./, function(str){ return str.toUpperCase(); });
	}
}