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

	$("#latestposts").html("Haetaan");

	$.ajax({
		type: "GET", 
		url: 'http://localhost:3000/api/post/', 
		dataType: 'json', 
		statusCode: {
			200:function(data) { 
				if (data.length != 0 && typeof data[0] != 'undefined')
				{
					var content = "";
					for (var i = 0; i < data.length; i++)
					{
						content += "<a href='/api/post/" + data[i].id + "'><h3>" + data[i].title + "</h3></a>";
						content += "<p>" + data[i].author + "<br>" + "Blogin nimi" + "</p>";
					}
					$("#latestposts").html(content);
				}
				else
					$("#latestposts").html("Palvelussa ei ole vielä blogikirjoituksia " + data.length);
			}, 
			404:function() { $("#latestposts").html("Uusimpia blogikirjoituksia ei saatu haettua"); }, 
			500:function() { $("#latestposts").html("Uusimpia blogikirjoituksia ei saatu haettua"); }
		}
	});

});

function getLatestPosts() {

	$("#latestposts").html("Haetaan");

	$.ajax({
		type: "GET", 
		url: 'http://localhost:3000/api/post/1', 
		dataType: 'json', 
		statusCode: {
			200:function(data) { 
				var content;
				for (var i = 0; i < data.length; i++)
				{
					var name = getBlogNameById(data[i].id); // funktio tiedostossa manageFollows.js
					content += '<a href="/api/post/' + data[i].id + '><h3>' + data[i].title + '</h3></a>';
					content += '<p>' + data[i].author + '<br>' + name + '</p>';
				}
				$("#latestposts").html(content + data.length);
			}, 
			404:function() { $("#latestposts").html("Uusimpia blogikirjoituksia ei saatu haettua"); }, 
			500:function() { $("#latestposts").html("Uusimpia blogikirjoituksia ei saatu haettua"); }
		}
	});
}
