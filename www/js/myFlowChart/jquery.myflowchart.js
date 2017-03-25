function myflowchart(){
	return {
		_initEvents:function(){
			var self = this;
			this._super();

            this.objs.layers.operators.on('dblclick', '.flowchart-operator', function (e) {
                if ($(e.target).closest('.flowchart-operator-connector').length == 0) {
                    self.dblClickOperator($(this).data('operator_id'));
                }
            });
		},
		callbackEvent: function(name, params) {
            var cbName = 'on' + name.charAt(0).toUpperCase() + name.slice(1);
            var ret = this.options[cbName].apply(this, params);
            if (ret !== false) {
                var returnHash = {'result': ret}
                this.element.trigger(name, params.concat([returnHash]));
                ret = returnHash['result'];
            }
            return ret;
        },
		dblClickOperator:function(operatorId){
			if (!this.callbackEvent('operatorDblClick', [operatorId])) {
                return;
            }
		},
		_getOperatorFullElement:function(operatorData){
				var infos = this.getOperatorCompleteData(operatorData);

				var fullElement = this._super(operatorData);
				console.log(infos.value);
				if (infos.value){
					var inputControl = this.getInputControl(infos.value);

					var $inputControl = $("<i class='glyphicon glyphicon-list'></i>");
					fullElement.operator.find(".flowchart-operator-inputs").prepend($inputControl);
				}
				return fullElement;
			},
		getInputControl:function(val){
			var inputControl;
			if (this[typeof(val)+"_inputControl"]){
				inputControl = this[typeof(val)+"_inputControl"].apply(val);
			}

			return inputControl;
		},
		string_inputControl:function(val){

			return "<input type='text' class='flowchart-input-control' />";
		},
		options:{
			onOperatorDblClick:function(operatorId){
				return true;
			}

		}
	};
}