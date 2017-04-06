var assert = require('assert');
var fs = require('fs');
var workflow1 = JSON.parse(fs.readFileSync('test/integration/services/test-workflow-1.json', 'utf8'));
var workflow2 = JSON.parse(fs.readFileSync('test/integration/services/test-workflow-parallel.json', 'utf8'));
var workflow3 = JSON.parse(fs.readFileSync('test/integration/services/test-workflow-double-concat.json', 'utf8'));

describe('WorkflowService',function(){
	describe("#createTasksHierarchy",function(){
		xit('should find root node(s)',function(done){
			var executionList = WorkflowService.createTasksHierarchy(workflow1);
			assert.equal(executionList[0],0,'workflow1 should 0 as its root');
			done();
		});

		xit('should find root node(s)',function(done){
			var executionList = WorkflowService.createTasksHierarchy(workflow3);
			console.log(executionList);
			_.each(executionList,function(idx){
				console.log(workflow3.operators[idx].properties.title);
			});
			assert.equal(executionList[0],1,'workflow3 should only have one root');
			done();
		});

		xit('should find node(s) dependencies',function(done){
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

		xit ('should create valid script',function(done){
			var script = WorkflowService.createExecutionScript(workflow3);
			console.log(script);
			eval(script);
			done();
		});

		it ('should run this',function(done){
			this.timeout(150000);
var _evt = {emit:function(evt,idx){console.log(evt+":"+idx)}};
var result_0;
var result_1;
var result_3;
var result_2;
var result_6;
var result_5;
var result_4;
var flow = require('node-control-flow');
flow.start({}, [function(flow) {
    _evt.emit('NODE_START', 0);
    var self = this;
    OperatorService.getOperatorModule('String').process("https://www.deviantart.com/browse/all/resources/applications/psbrushes/?order=9", function(err, output) {
        if (err) throw (err);
        result_0 = output;
        _evt.emit('NODE_FINISHED', 0);
        flow.next();
    });
}, function(flow) {
    _evt.emit('NODE_START', 1);
    var self = this;
    // OperatorService.getOperatorModule('page-downloader').process(result_0, function(err, output) {
    //     if (err) throw (err);
    //     result_1 = output;
    //     _evt.emit('NODE_FINISHED', 1);
    //     flow.next();
    // });
    result_1 = "<title>This is a title</title><p>Test <a href='lnk' class='some-class torpedo-thumb-link'>link</a></p>";
    _evt.emit('NODE_FINISHED', 1);
    flow.next();
}, function(flow) {
    _evt.emit('NODE_START', 3);
    var self = this;
    OperatorService.getOperatorModule('Object').process({
        "url": "a[class=\"torpedo-thumb-link\"]",
        "title": "title"
    }, function(err, output) {
        if (err) throw (err);
        result_3 = output;
        _evt.emit('NODE_FINISHED', 3);
        flow.next();
    });
}, function(flow) {
    _evt.emit('NODE_START', 2);
    var self = this;
    OperatorService.getOperatorModule('html-extract').process(result_1, result_3, function(err, output) {
        if (err) throw (err);
        result_2 = output;
        _evt.emit('NODE_FINISHED', 2);
        flow.next();
    });
}, function(flow) {
    _evt.emit('NODE_START', 6);
    var self = this;
    OperatorService.getOperatorModule('Object').process({
        "url.get.0.attribs.href": "url",
        "title.text": "title"
    }, function(err, output) {
        if (err) throw (err);
        result_6 = output;
        _evt.emit('NODE_FINISHED', 6);
        flow.next();
    });
}, function(flow) {
    _evt.emit('NODE_START', 5);
    var self = this;
    OperatorService.getOperatorModule('object-extract').process(result_2, result_6, function(err, output) {
        if (err) throw (err);
        result_5 = output;
        _evt.emit('NODE_FINISHED', 5);
        flow.next();
    });
}, function(flow) {
    _evt.emit('NODE_START', 4);
    var self = this;
    OperatorService.getOperatorModule('console-log').process(result_5, function(err, output) {
        if (err) throw (err);
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