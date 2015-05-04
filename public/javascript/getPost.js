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

function getLatestPosts() {

	$.ajax({
		type: "GET", 
		url: 'http://localhost:3000/api/post', 
		dataType: 'json', 
		statusCode: {
			200:function(data) { 
				var content;
				for (var i = 0; i < data.length; i++)
				{
					content += '<a href="/api/post/' + data[i].id + '><h3>' + data[i].title + '</h3></a>';
					content += '<p>' + data[i].author + '<br>' + data[i].name + '</p>';
				}
				$("#latestposts").html(content);
			}, 
			404:function() { $("#latestposts").html("Uusimpia blogikirjoituksia ei saatu haettua"); }, 
			500:function() { $("#latestposts").html("Uusimpia blogikirjoituksia ei saatu haettua"); }
		}
	});
}
