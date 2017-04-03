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

            this.objs.layers.operators.on('mouseover', '.flowchart-operator', function (e) {
                self._operatorMouseOver($(this).data('operator_id'));
            });

            this.objs.layers.operators.on('mouseout', '.flowchart-operator', function (e) {
                self._operatorMouseOut($(this).data('operator_id'));
            });            
		},
        _operatorMouseOver: function (operatorId) {
            if (!this.options.onOperatorMouseOver(operatorId)) {
                return;
            }
            this._addHoverClassOperator(operatorId);
        },	
		_addHoverClassOperator: function (operatorId) {
            this.data.operators[operatorId].internal.els.operator.addClass('hover');
        },
        _removeHoverClassOperators: function () {
            this.objs.layers.operators.find('.flowchart-operator').removeClass('hover');
        },        
        _operatorMouseOut: function (operatorId) {
            if (!this.options.onOperatorMouseOut(operatorId)) {
                return;
            }
            this._removeHoverClassOperators();
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
        addClass: function (operatorId,className){
            this.data.operators[operatorId].internal.els.operator.addClass(className);
        },
        removeClass: function (operatorId,className){
            this.data.operators[operatorId].internal.els.operator.removeClass(className);
        },	
        getData: function () {
            var data = this._super();
            $.each(data.links,function(idx,link){
            	link.fromOperator = parseInt(link.fromOperator);
            	link.fromSubConnector = parseInt(link.fromSubConnector);
            	link.toOperator = parseInt(link.toOperator);
            	link.toSubConnector = parseInt(link.toSubConnector);
            });
            console.log(data);
            return data;
        },		
        _autoCreateSubConnector: function (operator, connector, connectorType, subConnector) {
            var connectorInfos = this.data.operators[operator].properties[connectorType][connector];
            if (connectorInfos.multiple) {
                var fromFullElement = this.data.operators[operator].internal.els;
                var nbFromConnectors = this.data.operators[operator].internal.els.connectors[connector].length;
                for (var i = nbFromConnectors; i < parseInt(subConnector) + 2; i++) {
                    this._createSubConnector(connector, connectorInfos, fromFullElement);
                }
            }
        },
		_getOperatorFullElement:function(operatorData){
				//operatorData = jQuery.extend({},operatorData);
				//operatorData.properties = jQuery.extend({},operatorData.properties);
				var self = this;
				var infos = this.getOperatorCompleteData(operatorData);

				var fullElement = this._super(operatorData);
				
				if (typeof(operatorData.properties.value) != "undefined"){
					var inputControlHandler = this.getInputControlHandler(operatorData.properties.value);

					var $inputControl = $("<div title='"+JSON.stringify(operatorData.properties.value,null,'\t')+"' class='flowchart-operator-value'><i class='glyphicon glyphicon-list'></i> <span>"+getVisualRepresentation(operatorData.properties.value)+"</span></div>");
					$inputControl.click(
						function(evt){
							inputControlHandler(evt,operatorData.properties);
						}
					);
					
					fullElement.operator.find(".flowchart-operator-inputs").prepend($inputControl);
				}
				return fullElement;
		},
		getInputControlHandler:function(val){
			var inputControl;
			if (this[typeof(val)+"_inputControlHandler"]){
				inputControlHandler = this[typeof(val)+"_inputControlHandler"];
			}

			return inputControlHandler;
		},
		string_inputControlHandler:function(evt,val){
			var $frm = $(
				"<div title='Set string value'><form><label for='v'>Value:</label> "+
			 	"<input id='v' name='v' onfocus='this.value = this.value;' value='"+val.value+"' type='text' class='flowchart-input-control' />"+
			 	"<input type='submit' tabindex='-1' style='position:absolute; top:-1000px'></form>"+
			 	"</div>");
			function dialogSubmit(){
				$(evt.currentTarget)
					.attr("title",val.value = $frm.find("input").val())
					.find("span").text(getVisualRepresentation(val.value));
				$frm.dialog( "close" );
			}

			$frm.find("form").on('submit',function(e){
				e.preventDefault();
				dialogSubmit();
			});
			$frm
				.dialog({
					buttons: {
				        "Set value": function() {
				        	dialogSubmit();
				        },
				        Cancel: function() {
				          $( this ).dialog( "close" );
				        }
				      }
				});
		},
		number_inputControlHandler:function(evt,val){
			var $frm = $(
				"<div title='Set number value'><form><label for='v'>Value:</label> "+
			 	"<input id='v' name='v' onfocus='this.value = this.value;' value='"+val.value+"' type='text' class='flowchart-input-control' />"+
			 	"<input type='submit' tabindex='-1' style='position:absolute; top:-1000px'></form>"+
			 	"</div>");
			function dialogSubmit(){
				var actualVal = val.value;

				try{
					actualVal = parseFloat($frm.find("input").val());
				}catch(e){

				}
				$(evt.currentTarget)
					.attr("title",val.value = actualVal)
					.find("span").text(getVisualRepresentation(val.value));
				$frm.dialog( "close" );
			}

			$frm.find("form").on('submit',function(e){
				e.preventDefault();
				dialogSubmit();
			});
			$frm
				.dialog({
					buttons: {
				        "Set value": function() {
				        	dialogSubmit();
				        },
				        Cancel: function() {
				          $( this ).dialog( "close" );
				        }
				      }
				});
		},
		object_inputControlHandler:function(evt,val){
			var idx = 0;
			var html =
				"<div class='object_inputControlHandler_dlg' title='Set number value'><form>";
			$.each(Object.keys(val.value),function(index,key){
				var v;
				try{
					v = JSON.stringify(val.value[key]);
				}catch(e){
					v = val.value[key];
				}
				html +=
				"<input id='k"+idx+"' name='k"+idx+"'  value='"+key+"' type='text' class='flowchart-input-control' />:"+
			 	"<input id='v"+idx+"' name='v"+idx+"'  value='"+v+"' type='text' class='flowchart-input-control' />";
			 	idx++;
			});
				
			html += "<button>Add field</button>"
			html +=	"<input type='submit' tabindex='-1' style='position:absolute; top:-1000px'></form>"+
			 	"</div>";
			var $frm = $(html);
			$frm.find("button").click(function(e){
				e.preventDefault();
				$(this).before(
					"<input placeholder='field name' id='k"+idx+"' name='k"+idx+"'  value='' type='text' class='flowchart-input-control' />:"+
				 	"<input placeholder='field value' id='v"+idx+"' name='v"+idx+"'  value='' type='text' class='flowchart-input-control' />"
				 	);
				idx++;

			});
			function dialogSubmit(){
				var i=0;
				var jsonVal = {};
				while ($frm.find("#k"+i).length){
					var actualVal;
					try{
						actualVal = JSON.parse($frm.find("#v"+i).val());
					} catch(e){
						actualVal = $frm.find("#v"+i).val();
					}
					jsonVal[$frm.find("#k"+i).val()] = actualVal;
					i++;
				}
				jsonVal
				$(evt.currentTarget)
					.attr("title",JSON.stringify(val.value = jsonVal, null, '\t'))
					.find("span").text(getVisualRepresentation(val.value));
				$frm.dialog( "close" );
			}

			$frm.find("form").on('submit',function(e){
				e.preventDefault();
				dialogSubmit();
			});
			$frm
				.dialog({
					buttons: {
				        "Set value": function() {
				        	dialogSubmit();
				        },
				        Cancel: function() {
				          $( this ).dialog( "close" );
				        }
				      }
				});
		},				
		options:{
			onOperatorDblClick:function(operatorId){
				return true;
			},
	        onOperatorMouseOver: function (operatorId) {
	            return true;
	        },
            onOperatorMouseOut: function (operatorId) {
                return true;
            }	        
		}
	};
}

function getVisualRepresentation(val){
	if (typeof(val)=='string'){
		if (val.length + 3 <= 10){
			return val;
		} else {
			return val.substring(0,7)+"...";
		}
	} else if (typeof(val) == 'object'){
		return getVisualRepresentation(JSON.stringify(val));
	} else {
		return getVisualRepresentation(val.toString());
	}
}