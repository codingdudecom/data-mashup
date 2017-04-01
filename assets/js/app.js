var idx = 1;
var $flowchart = $('#flowchart');
var app = {
	start:function(){
		var projectName = "New project";
		$("#project-name").val(projectName);
		this.initProjectList();

		$flowchart.myflowchart({
		});

		io.socket.get('/project/connect', function responseFromServer (body, response) {
		  console.log("The server responded with status " + response.statusCode + " and said: ", body);
		});

		io.socket.on('CLIENT_NODE_START',function(idx){
			$flowchart.myflowchart("removeClass",idx,"node-started");
			$flowchart.myflowchart("removeClass",idx,"node-finished");
			$flowchart.myflowchart("addClass",idx,"node-started");
		});


		io.socket.on('CLIENT_NODE_FINISHED',function(idx){
			$flowchart.myflowchart("removeClass",idx,"node-started");
			$flowchart.myflowchart("removeClass",idx,"node-finished");
			$flowchart.myflowchart("addClass",idx,"node-finished");

			setTimeout(function(){
				$flowchart.myflowchart("removeClass",idx,"node-started");
				$flowchart.myflowchart("removeClass",idx,"node-finished");
			},2000);
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
          		var data = $.extend(true,{},dataTypes[$this.data("type")]);
          		
	        	return $flowchart.myflowchart('getOperatorElement', data);
	        },
	        stop: function(e, ui) {
	        	var flowchartOffset = $flowchart.offset();
				var elOffset = ui.offset;
                var relativeLeft = elOffset.left - flowchartOffset.left;
                var relativeTop = elOffset.top - flowchartOffset.top;
                
	        	var $this = $(this);
          		var data = $.extend(true,{},dataTypes[$this.data("type")]);
                data.left = relativeLeft;
                data.top = relativeTop;   
                data.id = "id"+idx++;
	        	$flowchart.myflowchart('addOperator', data);
	        }
		});
	},
	initProjectList:function(){
		var self = this;
		$("#project-list").html("");
		app.ProjectsCtrl.list(function(projects){
			$.each(projects,function(idx,project){
				$("#project-list")
					.append("<li><div class='btn-group'><button data-id='"+project.id+"' class='project-delete btn btn-danger glyphicon glyphicon-remove'></button><a data-id='"+project.id+"' href='#' class='btn btn-default' >"+project.name+"</a></div></li>");
			});
			$("#project-list a")
				.click(function(evt){
					evt.preventDefault();
					self.load($(evt.currentTarget).data("id"));
				});
			$("#project-list .project-delete")
				.click(function(evt){
					evt.preventDefault();
					self.deleteProject($(evt.currentTarget).data("id"));
				});
		});
		$("#project-new").click(function(evt) {
			evt.preventDefault();
			self.new();
		});
	},
	save:function(next){
		var self = this;
		var data = $flowchart.myflowchart('getData');
		var projectName = $("#project-name").val();
		
		app.ProjectsCtrl.save($flowchart.data("id"),projectName,data,function(project){
			$flowchart.data("id",project.id);
			$("#project-list [data-id='"+project.id+"']").text(projectName);
			self.initProjectList();
			if (next) next();
		});
	},
	load:function(id){
		$flowchart.myflowchart('setData',{});
		app.ProjectsCtrl.load(id,function(project){
			$flowchart.data("id",project.id);
			$("#project-name").val(project.name);
			$flowchart.myflowchart('setData',project.flowDefinition);
		});
	},
	new:function(){
		$flowchart.removeData("id");
		$("#project-name").val("New project");
		$flowchart.myflowchart('setData',{});

	},
	execute:function(){
		var self = this;
		self.save(function(){
			app.ProjectsCtrl.execute($flowchart.data("id"),function(){
				console.log("execution complete");
			});
		});
	},
	deleteProject:function(id){
		var self = this;
		app.ProjectsCtrl.delete(id,function(){
				self.initProjectList();
			});
	},
	deleteSelected:function(){
		$flowchart.myflowchart('deleteSelected');
	}
};

(function($){
	$(document).ready(function(){
		$.widget("custom.myflowchart",$.flowchart.flowchart,myflowchart());

		app.OperatorsCtrl.list(function(operatorNames){
			$.each(operatorNames,function(idx,operatorName){
				app.OperatorsCtrl.get(operatorName,function(operatorData){
					dataTypes[operatorName] = operatorData;
					if (idx == operatorNames.length - 1){
						$.each(dataTypes,function(el){
							$("#toolbox").append('<div class="draggable_op" data-type="'+el+'">'+dataTypes[el].properties.title+'</div>');
						});
						app.start();
					}
				});
			});
		});

		$('html').keyup(function(e){
		    if(e.keyCode == 46) {
		        app.deleteSelected();
		    }
		});
		
		
	});
})(jQuery);