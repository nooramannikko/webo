$(document).ready(function() {
	
	$("#newcomment").submit(function(e) {
		e.preventDefault();
		e.returnValue = false;
	
		var id = document.getElementById("new-comment-id").value;
		var data =  $("#newcomment").serialize();

		$.ajax({
			type: "POST",
			url: 'http://localhost:3000/api/post/' + id + '/comments',
			data: data,
			dataType: 'json',
			statusCode: {
				201:function(data) { $("#postoutput").html("Kommentin id: " + data["id"]); },
				400:function() { $("#postoutput").html("Puuttuva text"); },
				404:function(data) { $("#postoutput").html(data["statusText"]); }
			},
		});
	});

	$("#getpostcomments").submit(function(e) {
		e.preventDefault();
		e.returnValue = false;
	
		var id = document.getElementById("getcomments-id").value;
		$.ajax({
			type: "GET",
			url: 'http://localhost:3000/api/post/' + id + '/comments',
			dataType: 'json',
			statusCode: {
				200:function(data) { $("#postoutput").html("Kommentit haettu"); },
				404:function() { $("#postoutput").html("Haettua blogia ei löydy"); }
			},
		});
	});
});