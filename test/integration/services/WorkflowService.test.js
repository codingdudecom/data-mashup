var assert = require('assert');
var fs = require('fs');
var workflow1 = JSON.parse(fs.readFileSync('test/integration/services/test-workflow-1.json', 'utf8'));
var workflow2 = JSON.parse(fs.readFileSync('test/integration/services/test-workflow-parallel.json', 'utf8'));
var workflow3 = JSON.parse(fs.readFileSync('test/integration/services/test-workflow-double-concat.json', 'utf8'));

describe('WorkflowService',function(){
	describe("#createTasksHierarchy",function(){
		it('should find root node(s)',function(done){
			var executionList = WorkflowService.createTasksHierarchy(workflow1);
			assert.equal(executionList[0],0,'workflow1 should 0 as its root');
			done();
		});

		it('should find root node(s)',function(done){
			var executionList = WorkflowService.createTasksHierarchy(workflow3);
			console.log(executionList);
			_.each(executionList,function(idx){
				console.log(workflow3.operators[idx].properties.title);
			});
			assert.equal(executionList[0],1,'workflow3 should only have one root');
			done();
		});

		it('should find node(s) dependencies',function(done){
			var executionList = WorkflowService.createTasksHierarchy(workflow3);
			
			_.each(executionList,function(idx){
				var deps = WorkflowService.getDependencies(workflow3,idx);
				console.log(workflow3.operators[idx].properties.title+" <= "+deps);
				if (idx == 0){
					assert.equal(deps.length,2,'workflow3 concat node should have 2 dependencies');
				}
			});
			
			done();
		});

		it ('should create valid script',function(done){
			var script = WorkflowService.createExecutionScript(workflow3);
			console.log(script);
			eval(script);
			done();
		});

		it ('should create valid script',function(done){

			
			done();
		});

	})
})