$(document).ready(function() {
	
	$("#getfollowers").submit(function(e) {
		e.preventDefault();
		e.returnValue = false;
	
		var id = document.getElementById("getfollowers-blogid").value;
		$.ajax({
			type: "GET",
			url: 'http://localhost:3000/api/blog/' + id + '/followers',
			dataType: 'json',
			statusCode: {
				200:function(data) { $("#followoutput").html("Seuraajat haettu"); },
				404:function() { $("#followoutput").html("Blogia ei ole olemassa"); }
			},
		});
	});

	$("#getblogfollows").submit(function(e) {
		e.preventDefault();
		e.returnValue = false;
	
		var username = document.getElementById("getfollows-username").value;
		$.ajax({
			type: "GET",
			url: 'http://localhost:3000/api/user/' + username + '/follows',
			dataType: 'json',
			statusCode: {
				200:function(data) { $("#followoutput").html("Blogit haettu"); },
				404:function() { $("#followoutput").html("Haettua käyttäjää ei löydy"); }
			},
		});
	});

	$("#blogsfollowed").html("Haetaan");
	$.ajax({
		type: "GET", 
		url: 'http://localhost:3000/username', 
		dataType: 'json', 
		statusCode: {
			200:function(data) { getFollowedBlogs(data.username); }, 
			401:function() { $("#blogsfollowed").html("Et ole kirjautunut"); }
		}
	});

	/**/

});

function addFollow() {
	var id = document.getElementById("blogid-follow").value;
	var username = document.getElementById("username-follow").value
	$.ajax({
		type: "PUT", 
		url: 'http://localhost:3000/api/user/' + username + '/follows/' + id,
		dataType: 'json',
		statusCode: { 
			200: function() { $("#followoutput").html("Seuraaminen lisätty")}, 
			401: function() { $("#followoutput").html("Ei käyttöoikeutta")}, 
			404: function() { $("#followoutput").html("Käyttäjää tai blogia ei ole olemassa")}, 
			500: function(data) { $("#followoutput").html("Server error: " + data["error"])}
		}
	});
}

function removeFollow() {
	var id = document.getElementById("blogid-removefollow").value;
	var username = document.getElementById("username-removefollow").value
	$.ajax({
		type: "DELETE", 
		url: 'http://localhost:3000/api/user/' + username + '/follows/' + id,
		dataType: 'json',
		statusCode: { 
			200: function() { $("#followoutput").html("Seuraaminen poistettu")}, 
			401: function() { $("#followoutput").html("Ei käyttöoikeutta")}, 
			404: function() { $("#followoutput").html("Käyttäjää tai blogia ei ole olemassa")}, 
			500: function(data) { $("#followoutput").html("Server error: " + data["error"])}
		}
	});
}

function getFollowedBlogs(username) {

	$("#blogsfollowed").html("Haetaan blogeja käyttäjälle: " + username); 

	$.ajax({
		type: "GET",
		url: 'http://localhost:3000/api/user/' + username + '/follows',
		dataType: 'json',
		statusCode: {
			200:function(data) { 
				if (data.length != 0 && typeof data[0] != 'undefined')
				{
					/*var content = "";
					for (var i = 0; i < data.length; i++)
					{
						$("#blogsfollowed").html("Blogeja: " + content); 
						content += '<li><a href="/api/blog/' + data[i].id + '">' + data[i].name + '</a></li>';
					}
					$("#blogsfollowed").html(content); */
					var blogIDs = [];
					var names = [];
					for (var i = 0; i < data.length; i++)
					{
						blogIDs.push(data[i].id);
					}
					getBlogNames(blogIDs, names, 0, displayFollowedBlogs);
				}
				else
					$("#blogsfollowed").html("Et vielä seuraa yhtään blogia");
			},
			304:function() { $("#blogsfollowed").html("Et vielä seuraa yhtään blogia"); },
			404:function() { $("#blogsfollowed").html("Seurattuja blogeja ei saatu haettua"); }, 
			500:function() { $("#blogsfollowed").html("Seurattuja blogeja ei saatu haettua"); }
		},
	});

}

function getBlogNames(blogIDs, names, index, next) {

	// Jos kaikki nimet haettu
	if (index >= blogIDs.length) {
		next(blogIDs, names);
	}

	// Hae lisää nimiä
	else {
		$.ajax({
			type: "GET", 
			url: 'http://localhost:3000/api/blog/' + blogIDs[index], 
			dataType: 'json', 
			statusCode: {
				200: function(data) {
					names.push(data.name); 
					getBlogNames(blogIDs, names, index+1, next);
				}, 
				404:function() {
					names.push("Nimi tuntematon");
					getBlogNames(blogIDs, names, index+1, next);
				}
			}
		});
	}
}

function displayFollowedBlogs(blogIDs, names) {

	//$("#blogsfollowed").html(blogIDs.length + " " + names.length); 
	if (blogIDs.length != 0)
	{
		var content = "";
		for (var i = 0; i < blogIDs.length; i++)
		{
			content += '<li><a href="/api/blog/' + blogIDs[i] + '">' + names[i] + '</a></li>';
		}
		$("#blogsfollowed").html(content); 
	}
	else
		$("#blogsfollowed").html("Et vielä seuraa yhtään blogia");
}


