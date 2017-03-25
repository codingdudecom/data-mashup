var idx = 1;
var app = {
	start:function(){
		var $flowchart = $('#flowchart');
		$flowchart.myflowchart({
		});

		var $draggable_ops = $(".draggable_op");
		$draggable_ops.draggable({
			cursor: "move",
	        opacity: 0.7,
	        
	        helper: 'clone',
	        appendTo: 'body',
	        zIndex: 1000,
	        helper:function(e){
	        	var $this = $(this);
          		var data = dataTypes[$this.data("type")];
          		console.log(data);
	        	return $flowchart.myflowchart('getOperatorElement', data);
	        },
	        stop: function(e, ui) {
	        	var flowchartOffset = $flowchart.offset();
				var elOffset = ui.offset;
                var relativeLeft = elOffset.left - flowchartOffset.left;
                var relativeTop = elOffset.top - flowchartOffset.top;
                
	        	var $this = $(this);
          		var data = $.extend({},dataTypes[$this.data("type")]);
                data.left = relativeLeft;
                data.top = relativeTop;   
                data.id = "id"+idx++;
	        	$flowchart.myflowchart('addOperator', data);
	        }
		});
	}
};

(function($){
	$(document).ready(function(){
		$.widget("custom.myflowchart",$.flowchart.flowchart,myflowchart());
		app.start();
	});
})(jQuery);