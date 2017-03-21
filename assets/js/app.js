var idx = 1;
var app = {
	start:function(){
		var $flowchart = $('#flowchart');
    	var $container = $flowchart.parent();
		var cx = $flowchart.width() / 2;
    	var cy = $flowchart.height() / 2;
    	console.log(cx+":"+cy)
    	var possibleZooms = [0.5, 0.75, 1, 2, 3];
    	var currentZoom = 2;
    	
    $flowchart.flowchart({});
    	//.panzoom();
    	// Centering panzoom
    	//$flowchart.panzoom('pan', -cx + $container.width() / 2, -cy + $container.height() / 2);
		
	},
	addNode:function(data){
		$("#flowchart").flowchart('createOperator', "id"+idx++, $.extend({},data));
	}
};

(function($){
	$(document).ready(app.start);
})(jQuery);