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
		indexedTest.sort(function(x, y){return x.ind > y.ind ? 1 : x.ind == y.ind ? 0 : -1});
		deps = indexedTest.map(function(e){return e.val});
		return deps;
	},
	createExecutionScript:function(flowDefinition){
		var steps = [];
		var executionList = WorkflowService.createTasksHierarchy(flowDefinition);
		var forks = [];
		var script = "";
		_.each(executionList,function(idx){
			script += "var result_"+idx+";";
			var op = OperatorService.getOperatorModule(flowDefinition.operators[idx].properties.title);
			var deps = WorkflowService.getDependencies(flowDefinition,idx);
			if (deps.length == 0){
				steps.push(
					"function(flow){"+
					"_evt.emit('NODE_START',"+idx+");"+
					"var self = this;"+
					"OperatorService.getOperatorModule('"+flowDefinition.operators[idx].properties.title+"')"+
					".process("+JSON.stringify(flowDefinition.operators[idx].properties.value)+","+
					"function(err,output){if (err) throw(err);result_"+idx+" = output;_evt.emit('NODE_FINISHED',"+idx+");flow.next();});"+
					"}"
				);
			} else {
				var inputs = "";
				_.each(deps,function(dep,depIdx){
					inputs += "result_"+dep;
					if (depIdx != deps.length-1){
						inputs += ",";
					}
				});

				if (flowDefinition.operators[idx].properties.title == 'foreach'){
					forks.push("result_"+idx);
					steps.push(
						"function(flow){"+
						"_evt.emit('NODE_START',"+idx+");"+
						"var self = this;"+
						"flow.fork('_output',"+inputs+");"+
						"},"+
						"function(_output,flow){"+
						"var self = this;"+
						"result_"+idx+" = _output;_evt.emit('NODE_FINISHED',"+idx+");"+
						"flow.next();"+
						"}"
					);
				}else{
					

					steps.push(
						
						"function(flow){"+
						"_evt.emit('NODE_START',"+idx+");"+
						//"if (typeof(_output)!='undefined') console.log(_output);"+
						"var self = this;"+
						"OperatorService.getOperatorModule('"+flowDefinition.operators[idx].properties.title+"')"+
						".process("+inputs+","+
						"function(err,output){if (err) throw(err);result_"+idx+" = output;_evt.emit('NODE_FINISHED',"+idx+");flow.next();});"+
						"}"
					);
					// if (forks.indexOf(inputs)>=0){
					// 	forks.push("result_"+idx);
					// }
				}
			}
		});

		script += "var flow = require('node-control-flow');flow.start({},[";
		_.each(steps,function(step,idx){
			script += step;
			if (idx != steps.length - 1){
				script += ",";
			}
		});
		script += "],function(){console.log('Done!')})";

		return script;		
	},
	createExecutionScript1:function(flowDefinition){
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
					"function(err,output){if (err) throw(err);result_"+idx+" = output;self(undefined, output);});"+
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

				if (flowDefinition.operators[idx].properties.title == 'foreach'){
					steps.push(
						"function(){"+
						"var self = this;"+
						"var group = this.group();"+
						"_.each("+inputs+",function(el){"+
						"OperatorService.getOperatorModule('"+flowDefinition.operators[idx].properties.title+"')"+
						".process(el,"+
						"group())"+
						//"function(err,output){if (err) throw(err);result_"+idx+" = output;(self.parallel())(undefined, output);});"+
						"})"+
						"}"+

						",function(err,vals){"+
						"var self = this;"+
						// "console.log(vals);"+
						// "console.log('-------');"+
						"_.each(vals,function(val,_idx){"+
						// "console.log(val+'/'+_idx);"+
						"result_"+idx+" = val;"+
						"self(undefined,val);"+
						"})"+
						"}"


					);
				}else{
					steps.push(
						"function(){"+
						// "console.log("+inputs+");"+
						"var self = this;"+
						"OperatorService.getOperatorModule('"+flowDefinition.operators[idx].properties.title+"')"+
						".process("+inputs+","+
						"function(err,output){if (err) throw(err);result_"+idx+" = output;self(undefined, output);});"+
						"}"
					);
				}
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