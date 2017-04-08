var NutrientDataLaboratory = require('nutrient-data-laboratory');

module.exports = {
	process:function(input,next){
		var api = new NutrientDataLaboratory(input.apiKey);

		console.log(api);
		(api[input.endpoint])(input,function(err,output){
			if (err) throw(err);

			next(undefined,output);
		});
	}
}