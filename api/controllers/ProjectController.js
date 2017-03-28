/**
 * ProjectController
 *
 * @description :: Server-side logic for managing Projects
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	execute:function(req,res){
		var projectId = req.query["id"];
		Project
			.findOne({id:projectId})
			.exec(function(err, project){
				if (err) res.negotiate(err);

				res.json(project);
			});
	}
};

