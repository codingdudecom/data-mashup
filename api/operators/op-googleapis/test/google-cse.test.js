if (!process.env.GOOGLE_API_KEY){
	throw "This requires the Google API Key to be set as the environment variable GOOGLE_API_KEY"
}

if (!process.env.GOOGLE_SEARCH_ENGINE_ID){
	throw "This requires the Google Custom Search Engine ID to be set as the environment variable GOOGLE_SEARCH_ENGINE_ID"
}


var assert = require("assert");
var opGoogleAPIS = require("../../op-googleapis")

describe('op-googleapis', function() {
  	describe('#google custom search', function() {

    	it('should perform a google search', function (done) {
	        this.timeout(150000);
	        var input = 
	        {
	        	api:"customsearch",
	        	endpoint:"cse.list",
	        	// auth:process.env.GOOGLE_API_KEY,
	        	// cx:process.env.GOOGLE_SEARCH_ENGINE_ID,
	        	q:"test"
	        };

	        opGoogleAPIS.process(input,function(err,out){
	        	if (err) throw(err);
	        	assert.ok(out);
	        	// console.log(out);
	        	done();
	        })
	        
    	});
	})
})