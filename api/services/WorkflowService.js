var toposort = require('toposort');

module.exports = {
	createTasksHierarchy:function(flowDefinition){
		var graph = [];
		_.each(flowDefinition.links,function(link){
			graph.push([link.fromOperator,link.toOperator]);
		});

		var executionList = toposort(graph);
		return executionList;
	},
	getDependencies:function(flowDefinition,nodeIdx){
		var dependencies = [];
		_.each(flowDefinition.links,function(link){
			if (link.toOperator == nodeIdx){
				dependencies.push(link.fromOperator);
			}
		});
		return dependencies;
	},
	createExecutionScript:function(flowDefinition){
		var steps = [];
		var executionList = WorkflowService.createTasksHierarchy(flowDefinition);
		
		var script = "";
		_.each(executionList,function(idx){
			script += "var result_"+idx+";";
			var op = OperatorService.getOperatorModule(flowDefinition.operators[idx].properties.title);
			var deps = WorkflowService.getDependencies(flowDefinition,idx);
			if (deps.length == 0){
				steps.push(
					"function(){"+
					"var self = this;"+
					"OperatorService.getOperatorModule('"+flowDefinition.operators[idx].properties.title+"')"+
					".process("+JSON.stringify(flowDefinition.operators[idx].properties.value)+","+
					"function(err,output){if (err) throw err;result_"+idx+" = output;self(undefined, output);});"+
					"}"
				);
			} else {
				var inputs = "";
				_.each(deps,function(dep,depIdx){
					inputs += "result_"+dep;
					if (depIdx != deps.length-1){
						inputs += ",";
					}
				})
				steps.push(
					"function(){"+
					"var self = this;"+
					"OperatorService.getOperatorModule('"+flowDefinition.operators[idx].properties.title+"')"+
					".process("+inputs+","+
					"function(err,output){if (err) throw err;result_"+idx+" = output;self(undefined, output);});"+
					"}"
				);
			}
		});

		script += "var Step = require('step');Step(";
		_.each(steps,function(step,idx){
			script += step;
			if (idx != steps.length - 1){
				script += ",";
			}
		});
		script += ")";

		return script;
	}
}