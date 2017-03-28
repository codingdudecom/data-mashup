module.exports = {
	createTasksHierarchy:function(flowDefinition){
		this.discovered = [];
		this.traverse(flowDefinition,0);
		console.log(this.discovered);
		return this.discovered;
	},
	traverse:function(flowDefinition,idx){
		// 1  procedure DFS(G,v):
		// 2      label v as discovered
		// 3      for all edges from v to w in G.adjacentEdges(v) do
		// 4          if vertex w is not labeled as discovered then
		// 5              recursively call DFS(G,w)
		var self = this;
		this.discovered.push(idx);
		_.each(flowDefinition.links,function(link){
			if (link.fromOperator == idx){
				if (self.discovered.indexOf(link.toOperator) < 0){
					self.traverse(flowDefinition,parseInt(link.toOperator));
				}
			} 
		});
	}
}