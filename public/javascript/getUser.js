$(document).ready(function() {
	
	$("#getuser").submit(function(e) {
		e.preventDefault();
		e.returnValue = false;
	
		var username = document.getElementById("getuser-username").value;
		$.ajax({
			type: "GET",
			url: 'http://localhost:3000/api/user/' + username,
			dataType: 'json',
			statusCode: {
				200:function(data) { $("#output").html("name: " + data["name"] + "<br> username: " + data["username"]); },
				404:function() { $("#output").html("Haettua käyttäjää ei löydy"); }
			},
		});
	});

	$("#getauthoredblogs").submit(function(e) {
		e.preventDefault();
		e.returnValue = false;
	
		var username = document.getElementById("getauthoredblogs-username").value;
		$.ajax({
			type: "GET",
			url: 'http://localhost:3000/api/user/' + username + '/blogs',
			dataType: 'json',
			statusCode: {
				200:function(data) { $("#output").html("Blogit: ..."); },
				404:function() { $("#output").html("Haettua käyttäjää ei löydy"); }
			},
		});
	});
});

function getAuthoredBlogs() {

	var username; // Hae elementistä, johon käyttäjän nimi laitetaan näkyviin

	$.ajax({
		type: "GET",
		url: 'http://localhost:3000/api/user/' + username + '/blogs',
		dataType: 'json',
		statusCode: {
			200:function(data) { 
				var content;
				for (var i = 0; i < data.length; i++)
				{
					var name = getBlogNameById(data[i].id); // funktio tiedostossa manageFollows.js
					content += '<li><a href="/api/blog' + data[i].id + '>' + name + '</a></li>';
				}
				$("#authoredblogs").html(content); },
			404:function() { $("#authoredblogs").html("Blogeja ei saatu haettua"); }
		},
	});

}