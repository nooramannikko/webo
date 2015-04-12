$(document).ready(function() {
	
	$("#getsinglepost").submit(function(e) {
		e.preventDefault();
		e.returnValue = false;
	
		var id = document.getElementById("getpost-postid").value;
		$.ajax({
			type: "GET",
			url: 'http://localhost:3000/api/post/' + id,
			dataType: 'json',
			statusCode: {
				200:function(data) { $("#postoutput").html("title: " + data["title"] 
					+ "<br> text: " + data["text"] + "<br> author: " + data["author"] 
					+ "<br> likes: " + data["likes"]); },
				404:function() { $("postoutput").html("Haettua viestiä ei löydy"); }
			},
		});
	});
});