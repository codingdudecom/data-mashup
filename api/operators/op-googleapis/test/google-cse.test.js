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
	        	cx:process.env.GOOGLE_SEARCH_ENGINE_ID,
	        	q:"test"
	        };

	        opGoogleAPIS.process(input,function(err,out){
	        	if (err) throw(err);
	        	assert.ok(out);
	        	console.log(out);
	        	done();
	        })
	        
    	});
	});

	describe('#google language',function(){
		it ('should return sentiment score',function(done){
			var input = {
			    "api": "language",
			    "endpoint": "documents.analyzeSentiment",
			    "fields": "documentSentiment,sentences",
		    	resource:
			    {
			    	"document": {
		            "content": "Downloaded Thank You",
		            "type": "PLAIN_TEXT"
		        	}
		        }
			};

			opGoogleAPIS.process(input,function(err,out){
	        	if (err) throw(err);
	        	assert.ok(out);
	        	console.log(out);
	        	done();
	        });
		})

		xit('should call analyzeSentiment',function(done){
			this.timeout(15000);
			var req = require('request');

			var opt = { url: 'https://language.googleapis.com/v1/documents:analyzeSentiment',
			  method: 'POST',
			  json: { document: { content: 'Downloaded Thank You', type: 'PLAIN_TEXT' } },
			  // body: { document: { content: 'Downloaded Thank You', type: 'PLAIN_TEXT' } },
			  headers: {},
			  qs:
			   { fields: 'documentSentiment,sentences',
			     key: 'AIzaSyDrkPu1XzXFoVEfXk7HwS6_ghKFYMTmo0Q' },
			  useQuerystring: true };
			req(opt,function(err,resp){
				console.log(err);
				// console.log(JSON.stringify(resp.body.error.details[0]));
				resp.on('data',function(data){
					console.log('decoded chunk: ' + data);
				});
				resp.on('end',done);
				resp.on('abort',done);
				resp.on('close',done);
			})
			
		})
	})
})