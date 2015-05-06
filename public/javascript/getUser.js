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

	$("#authoredblogs").html("Haetaan");
	$.ajax({
		type: "GET", 
		url: 'http://localhost:3000/api/username', 
		dataType: 'json', 
		statusCode: {
			200:function(data) { getAuthoredBlogs(data.username); }, 
			401:function() { $("#authoredblogs").html("Et ole kirjautunut"); }
		}
	});
});

function getAuthoredBlogs(username) {

	$.ajax({
		type: "GET",
		url: 'http://localhost:3000/api/user/' + username + '/blogs',
		dataType: 'json',
		statusCode: {
			200:function(data) { 
				var blogIDs = [];
				var names = [];
				for (var i = 0; i < data.length; i++)
				{
					blogIDs.push(data[i].id);
				}
				getBlogNames(blogIDs, names, 0, displayAuthoredBlogs);
			},
			404:function() { $("#authoredblogs").html("Blogeja ei saatu haettua"); }
		},
	});

}

function displayAuthoredBlogs(blogIDs, names) {
	if (blogIDs.length != 0)
	{
		var content = '<ul>';
		for (var i = 0; i < blogIDs.length; i++)
		{
			content += '<li><a href="/api/blog/' + blogIDs[i] + '">' + names[i] + '</a></li>';
		}
		content += '</ul>';
		$("#authoredblogs").html(content); 
	}
	else
		$("#authoredblogs").html("Et vielä seuraa yhtään blogia");
}

