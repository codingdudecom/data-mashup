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
		var order = [];
		_.each(flowDefinition.links,function(link){
			if (link.toOperator == nodeIdx){
				dependencies.push(link.fromOperator);
				order.push(Object.keys(flowDefinition.operators[nodeIdx].properties.inputs).indexOf(link.toConnector));
			}
		});
		var deps = [];
		var indexedTest = dependencies.map(function(e,i){return {ind: order[i], val: e}});
		indexedTest.sort(function(x, y){return x.val > y.val ? 1 : x.val == y.val ? 0 : -1});
		deps = indexedTest.map(function(e){return e.val});
		// console.log(flowDefinition.operators[nodeIdx].properties.title +" <= "+deps);
		return deps;
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