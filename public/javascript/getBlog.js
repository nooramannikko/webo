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

	$("#newblogpost").submit(function(e) {
		e.preventDefault();
		e.returnValue = false;
		
		var id = document.getElementById("new-post-id").value;
		var data =  $("#newblogpost").serialize();
		$.ajax({
			type: "POST",
			url: 'http://localhost:3000/api/blog/' + id + '/posts',
			data: data,
			dataType: 'json',
			statusCode: {
				200:function(data) { $("#blogoutput").html("Viesti " + data["id"] + " tallennettu"); },
				400:function() { $("#blogoutput").html("Tietoja puuttuu"); },
				404:function(data) { $("#blogoutput").html(data["statusText"]); },
				500:function(data) { $("#blogoutput").html(data["responseText"]); }
			},
		});
	});
});


