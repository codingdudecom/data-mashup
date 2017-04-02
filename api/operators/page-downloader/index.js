var request = require('request');

module.exports = {
	process:function(page,next){
		var options = {
		  url: page,
		  headers: {
		    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.98 Safari/537.36'
		  }
		};
		
		request(options, function (error, response, body) {
			if (error) return next(error);
			// console.log('statusCode:', response && response.statusCode);
			return next(undefined,body);
		});
	}
}