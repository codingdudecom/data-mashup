app.OperatorsCtrl = {
	list:function(next){
		$.getJSON("/operators/list",next);
	},
	get:function(operatorName,next){
		$.getJSON("/operators/getOperatorData/"+operatorName,next);	
	}
}