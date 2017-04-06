var assert = require('assert');
var sinon = require('sinon');
var fs = require('fs');
var sandbox;


describe('OperatorService', function() {

beforeEach(function(done){
  sandbox = sinon.sandbox.create();
  sandbox.stub(fs,'readdirSync').callsFake(function(srcpath){
    console.log(srcpath);
    return ["mock-operator1","mock-operator2"];
  });
  sandbox.stub(fs,'statSync').callsFake(function(srcpath){
    return {isDirectory:function(){return true;}};
  });
  done();
})

afterEach(function(done){
  sandbox.restore();
  done();
})

  describe('#getOperators()', function() {
    it('should return list of operators from the api/operators folder', function (done) {
      var operators = OperatorService.getOperators();
      assert.equal(operators.length,2,'did not get the expected number of operators');
      done();
    });
  });

  describe('#getOperatorData()',function(){
    it('should return the operator data extracted from the function implementing the operator',function(done){
      var getOperatorModuleStub = sinon.stub(OperatorService,'getOperatorModule');
      getOperatorModuleStub.returns(
        {
          process:function(inputStringText,next){

          }
        }
      );
      var operatorData = OperatorService.getOperatorData("mock-operator1");
      assert.notEqual(operatorData,null,'got null value for operator data');
      assert.equal("Input string text",operatorData.properties.inputs.inputStringText.label);
      getOperatorModuleStub.restore();
      done();
    });
  });

  describe("#camelCaseToSpace()",function(){
    it('should normalize camel case',function(done){
      assert.equal(OperatorService.camelCaseToSpace("thisShouldBeChangedToNormal"),'This should be changed to normal');
      assert.equal(OperatorService.camelCaseToSpace("AB"),'A b');
      assert.equal(OperatorService.camelCaseToSpace("this"),'This');
      done();
    });
  })

});