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

	$("#getblogposts").submit(function(e) {
		e.preventDefault();
		e.returnValue = false;
	
		var id = document.getElementById("getpost-blogid").value;
		$.ajax({
			type: "GET",
			url: 'http://localhost:3000/api/blog/' + id + '/posts',
			dataType: 'json',
			statusCode: {
				200:function(data) { $("#blogoutput").html("Viestit haettu"); },
				404:function() { $("#blogoutput").html("Haettua blogia ei löydy"); }
			},
		});
	});

	$("#getsinglepost").submit(function(e) {
		e.preventDefault();
		e.returnValue = false;
	
		var id = document.getElementById("getpost-postid").value;
		$.ajax({
			type: "GET",
			url: 'http://localhost:3000/api/post/' + id,
			dataType: 'json',
			statusCode: {
				200:function(data) { $("#blogoutput").html("Viesti haettu"); },
				404:function() { $("#blogoutput").html("Haettua blogia ei löydy"); }
			},
		});
	});
});
