/**
 * OperatorsController
 *
 * @description :: Server-side logic for managing Operators
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

const fs = require('fs')
const path = require('path')

module.exports = {
	list:function(req,res){
		return res.json(OperatorService.getOperators());
	},
	getOperatorData:function(req,res){
		var operatorName = req.params["id"];
		var data = OperatorService.getOperatorData(operatorName);
		if (data != null){
			return res.json(data);
		} else {
			return res.negotiate("operator not found");
		}
	},
	
};

