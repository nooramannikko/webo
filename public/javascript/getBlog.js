$(document).ready(function() {
	
	$("#getblog").submit(function(e) {
		e.preventDefault();
		e.returnValue = false;
	
		var id = document.getElementById("getblog-blogid").value;
		$.ajax({
			type: "GET",
			url: 'http://localhost:3000/api/blog/' + id,
			dataType: 'json',
			statusCode: {
				200:function(data) { $("#blogoutput").html("id: " + data["id"] + "<br> name: " + data["name"]); },
				404:function() { $("#blogoutput").html("Haettua blogia ei löydy"); }
			},
		});
	});
});
