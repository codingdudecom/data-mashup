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
			this.timeout(150000);
var _evt = {emit:function(evt,idx){console.log(evt+":"+idx)}};

var result_3;
var result_2;
var result_0;
var result_1;
var result_4;
var flow = require('node-control-flow');
flow.start({}, [function(flow) {
    _evt.emit('NODE_START', 3);
    var self = this;
    OperatorService.getOperatorModule('Number').process("0", function(err, output) {
        if (err) throw err;
        result_3 = output;
        _evt.emit('NODE_FINISHED', 3);
        flow.next();
    });
}, function(flow) {
    _evt.emit('NODE_START', 2);
    var self = this;
    OperatorService.getOperatorModule('String').process("field1", function(err, output) {
        if (err) throw err;
        result_2 = output;
        _evt.emit('NODE_FINISHED', 2);
        flow.next();
    });
}, function(flow) {
    _evt.emit('NODE_START', 0);
    var self = this;
    OperatorService.getOperatorModule('Object').process(undefined, function(err, output) {
        if (err) throw err;
        result_0 = output;
        _evt.emit('NODE_FINISHED', 0);
        flow.next();
    });
}, function(flow) {
    _evt.emit('NODE_START', 1);
    var self = this;
    console.log(result_0)
    OperatorService.getOperatorModule('set-object-field').process(result_0, result_2, result_3, function(err, output) {
        if (err) throw err;
        result_1 = output;
        _evt.emit('NODE_FINISHED', 1);
        flow.next();
    });
}, function(flow) {
    _evt.emit('NODE_START', 4);
    var self = this;
    OperatorService.getOperatorModule('console-log').process(result_1, function(err, output) {
        if (err) throw err;
        result_4 = output;
        _evt.emit('NODE_FINISHED', 4);
        flow.next();
    });
}], function() {
    console.log('Done!')
})

			done();
		});

	})
})