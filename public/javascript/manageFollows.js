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
	
		var username = document.getElementById("username-removefollow").value;
		$.ajax({
			type: "GET",
			url: 'http://localhost:3000/api/user/' + username + '/follows',
			dataType: 'json',
			statusCode: {
				200:function(data) { $("#followoutput").html("Blogin haettu"); },
				404:function() { $("#followoutput").html("Haettua käyttäjää ei löydy"); }
			},
		});
	});
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
