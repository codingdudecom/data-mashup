var assert = require('assert');
var fs = require('fs');
var workflow1 = JSON.parse(fs.readFileSync('test/integration/services/test-workflow-1.json', 'utf8'));
var workflow2 = JSON.parse(fs.readFileSync('test/integration/services/test-workflow-parallel.json', 'utf8'));

describe('WorkflowService',function(){
	describe("#createTasksHierarchy",function(){
		it('should find root node(s)',function(done){
			var tasks = WorkflowService.createTasksHierarchy(workflow1);
			assert.equal(Object.keys(tasks).length,1,'workflow1 should only have one root');
			done();
		});
	})
})