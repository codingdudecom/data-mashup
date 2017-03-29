var toposort = require('toposort');

module.exports = {
	createTasksHierarchy:function(flowDefinition){
		var graph = [];
		_.each(flowDefinition.links,function(link){
			graph.push([link.fromOperator,link.toOperator]);
		});

		var executionList = toposort(graph).reverse();
		console.log(executionList);
	}
}