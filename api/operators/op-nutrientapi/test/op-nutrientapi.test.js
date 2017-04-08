var assert = require("assert");
var opNutrientAPI = require("../../op-nutrientapi");

describe("op-nutrientapi",function(){
	it ("should return nutrient list",function(done){
		this.timeout(15000);
		var input = {
			apiKey:'INPUT_YOUR_KEY',
			endpoint:'lists',
			lt:'g'
		}
		opNutrientAPI.process(input,function(err, output){
			console.log(output.list.item);
			done();	
		})
		
	})
})