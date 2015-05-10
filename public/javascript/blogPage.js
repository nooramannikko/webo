$(document).ready(function() {

	var href = document.URL;
	href= href.substr(href.lastIndexOf('/') + 1);

	$.ajax({
		type: "GET",
		url: 'http://localhost:3000/api/blog/' + href + '/posts',
		dataType: 'json',
		statusCode: {
			200:function(data) { tulostaBloginTiedot(data); },
			404:function() { $("#blogin10kirjoitusta").html("Haettua blogia ei löydy"); }
		},
	});

	$("#newblogpost").submit(function(e) {
		e.preventDefault();
		e.returnValue = false;
		
		var id = document.URL;
		id = id.substr(id.lastIndexOf('/') + 1);
		var data =  $("#newblogpost").serialize();
		$.ajax({
			type: "POST",
			url: 'http://localhost:3000/api/blog/' + id + '/posts',
			data: data,
			dataType: 'json',
			statusCode: {
				200:function(data) { $("#newblogpost-success").html("Viesti " + data["id"] + " tallennettu onnistuneesti."); },
				400:function() { $("#newblogpost-success").html("Tietoja puuttuu."); },
				404:function(data) { $("#newblogpost-success").html(data["statusText"]); },
				500:function(data) { $("#newblogpost-success").html(data["responseText"]); }
			},
		});
	});
});

function tulostaBloginTiedot(data) {
	var div = document.getElementById('blogin10kirjoitusta');

	if (data.length == 0) {
		div.innerHTML = "Ei viestejä";
	}

	for(var i = data.length - 1; i >= 0; i--) {
		div.innerHTML += '<a href="/post/' + data[i].id + '" ><b>' + data[i].title + '</b></a><br>' + data[i].text + '<br>Kommentteja: ';

		$.ajax({
       		async: false,
			type: "GET",
			url: 'http://localhost:3000/api/post/' + data[i].id + '/commentcount',
			dataType: 'json',
			statusCode: {
				200:function(data) { div.innerHTML += data.comments + ', Tykkäyksiä: '; },
				404:function() { $("#postoutput").html("Haettua viestiä ei löydy"); }
			},
		});
		$.ajax({
       		async: false,
			type: "GET",
			url: 'http://localhost:3000/api/post/' + data[i].id,
			dataType: 'json',
			statusCode: {
				200:function(data) { div.innerHTML += data.likes + '<br><br>'; },
				404:function() { $("postoutput").html("Haettua viestiä ei löydy"); }
			},
		});
	}
}

function addUser() {

	var username = document.getElementById("usernametoadd").value;
	var id = document.URL;
	id = id.substr(id.lastIndexOf('/') + 1);

	$.ajax({
		type: "PUT", 
		url: 'http://localhost:3000/api/blog/' + id + '/author/' + username,
		dataType: 'json', 
		statusCode: {
			200: function() { $("#addauthoreduser-success").html("Kirjoitusoikeus lisätty"); }, 
			403: function() { $("#addauthoreduser-success").html("Oletusblogiin ei voida lisätä käyttäjiä"); }, 
			404: function() { $("#addauthoreduser-success").html("Käyttäjää tai blogia ei löydy"); }
		}
	});
}

function removeUser() {

	var username = document.getElementById("usernametoremove").value;
	var id = document.URL;
	id = id.substr(id.lastIndexOf('/') + 1);

	$.ajax({
		type: "DELETE", 
		url: 'http://localhost:3000/api/blog/' + id + '/author/' + username,
		dataType: 'json', 
		statusCode: {
			200: function() { $("#removeauthoreduser-success").html("Kirjoitusoikeus poistettu"); }, 
			403: function() { $("#removeauthoreduser-success").html("Oletusblogista ei voida poistaa käyttäjiä"); }, 
			404: function() { $("#removeauthoreduser-success").html("Käyttäjää tai blogia ei löydy"); }
		}
	});
}

function addFollow() {
	var id = document.URL;
	id = id.substr(id.lastIndexOf('/') + 1);
	$.ajax({
		// Hae autentikoitu käyttäjä
		type: "GET", 
		url: 'http://localhost:3000/api/username', 
		dataType: 'json', 
		statusCode: {
			200:function(data) {
				var username = data["username"];
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
			},
			404:function() { $("#followoutput").html("Et ole kirjautunut"); }
		}
	});
}

function removeFollow() {
	var id = document.URL;
	id = id.substr(id.lastIndexOf('/') + 1);
	$.ajax({
		// Hae autentikoitu käyttäjä
		type: "GET", 
		url: 'http://localhost:3000/api/username', 
		dataType: 'json', 
		statusCode: {
			200:function(data) {
				var username = data["username"];
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
			},
			404:function() { $("#followoutput").html("Et ole kirjautunut"); }
		}
	});
}
