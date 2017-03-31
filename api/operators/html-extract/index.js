var cheerio = require('cheerio');
module.exports={
	process:function(html,selectors,next){
		var $ = cheerio.load(html);
		var output = {};
		_.each(Object.keys(selectors),function(selectorName){
			output[selectorName] = $(selectors[selectorName]);
		})
		// console.log("+++"+output);
		next(undefined,output);
	}
}