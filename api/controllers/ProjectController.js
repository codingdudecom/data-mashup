/**
 * ProjectController
 *
 * @description :: Server-side logic for managing Projects
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */


var EventEmitter = require('events');
var _evt = new EventEmitter();

module.exports = {
	connect:function(req,res){
		sails.sockets.join(req, "projectStatus");
	},
	execute:function(req,res){
		var projectId = req.query["id"];
		Project
			.findOne({id:projectId})
			.exec(function(err, project){
				if (err) res.negotiate(err);

				

				_evt.on('NODE_START',(idx) => {
					sails.sockets.broadcast("projectStatus","CLIENT_NODE_START",idx);
				});

				_evt.on('NODE_FINISHED',(idx) => {
					sails.sockets.broadcast("projectStatus","CLIENT_NODE_FINISHED",idx);
				});



				var script = WorkflowService.createExecutionScript(project.flowDefinition);
				console.log(script);
				try{
					eval(script);
				}catch(e){
					console.log(e);
					res.negotiate(e);
				}
				res.json("ok");
			});
	}
};

