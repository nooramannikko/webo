$(document).ready(function() {

	loadComments();

	(function poll() {
		setTimeout(function() {
			if (document.getElementById("autoload").checked)
				loadComments();
			poll();
		}, 15000)
	})();

	$("#newcomment").submit(function(e) {
		e.preventDefault();
		e.returnValue = false;
	
		var id = document.URL;
		id = id.substr(id.lastIndexOf('/') + 1);
		var data =  $("#newcomment").serialize();

		$.ajax({
			type: "POST",
			url: '/api/post/' + id + '/comments',
			data: data,
			dataType: 'json',
			statusCode: {
				201:function(data) { $("#comment-success").html("Kommentti lisätty"); },
				400:function() { $("#comment-success").html("Kommentin teksti puuttuu"); },
				404:function(data) { $("#comment-success").html(data["statusText"]); }
			},
		});
	});
	
});

function loadComments() {
	var id = document.URL;
	id = id.substr(id.lastIndexOf('/') + 1);

	$.ajax({
		type: "GET",
		url: '/api/post/' + id + '/comments',
		dataType: 'json',
		statusCode: {
			200:function(data) { 
				var content = "";
				for (var i = 0; i < data.length; i++) {
					content += "<li>" + data[i].text + "<br>Kirjoittanut: " 
					+ data[i].author + "</li>";
				}
				if (content.length == 0)
					$("#ladatutkommentit").html("Viestiä ei ole vielä kommentoitu");
				else
					$("#ladatutkommentit").html(content);
			},
			404:function() { $("#ladatutkommentit").html("Latauksessa tapahtui virhe"); }
		},
	});
}

function addLike() {
	var id = document.URL;
	id = id.substr(id.lastIndexOf('/') + 1);

	$.ajax({
		// Hae autentikoitu käyttäjä
		type: "GET", 
		url: '/api/username', 
		dataType: 'json', 
		statusCode: {
			200:function(data) {
				var username = data["username"];
				$.ajax({
					type: "PUT", 
					url: 'http://localhost:3000/api/user/' + username + '/likes/' + id,
					dataType: 'json',
					statusCode: { 
						200: function() {
							var autoload = document.getElementById("autoload").checked;
							window.location.reload();
							document.getElementById("autoload").checked = autoload;
						}, 
						401: function() { $("#like-error").html("Ei käyttöoikeutta"); }, 
						404: function() { $("#like-error").html("Käyttäjää tai viestiä ei ole olemassa"); }, 
						500: function(data) { $("#like-error").html("Server error: " + data["error"]); }
					}
				});
			},
			404:function() { $("#like-error").html("Et ole kirjautunut"); }
		}
	});
}

function removeLike() {
	var id = document.URL;
	id = id.substr(id.lastIndexOf('/') + 1);

	$.ajax({
		// Hae autentikoitu käyttäjä
		type: "GET", 
		url: '/api/username', 
		dataType: 'json', 
		statusCode: {
			200:function(data) {
				var username = data["username"];
				$.ajax({
					type: "DELETE", 
					url: '/api/user/' + username + '/likes/' + id,
					dataType: 'json',
					statusCode: { 
						200: function() {
							var autoload = document.getElementById("autoload").checked;
							window.location.reload();
							document.getElementById("autoload").checked = autoload;
						}, 
						401: function() { $("#like-error").html("Ei käyttöoikeutta"); }, 
						404: function() { $("#like-error").html("Käyttäjää tai viestiä ei ole olemassa"); }, 
						500: function(data) { $("#like-error").html("Server error: " + data["error"]); }
					}
				});
			},
			404:function() { $("#like-error").html("Et ole kirjautunut"); }
		}
	});
}

