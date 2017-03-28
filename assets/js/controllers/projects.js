app.ProjectsCtrl = {
	save:function(id,name,flowDefinition,next){
		$.post("/project"+(id?"/"+id:""),
			{
				name:name,
				flowDefinition:flowDefinition
			},next,"json");
	},
	load:function(id,next){
		$.getJSON("/project/"+id,next);
	},
	list:function(next){
		$.getJSON("/project",next);
	},
	execute:function(id,next){
		$.getJSON("/project/execute",{id:id},next);
	}
}