function addLike() {
	var id = document.getElementById("postid-addlike").value;
	var username = document.getElementById("username-addlike").value
	$.ajax({
		type: "PUT", 
		url: 'http://localhost:3000/api/user/' + username + '/likes/' + id,
		dataType: 'json',
		statusCode: { 
			200: function() { $("#postoutput").html("Tykkäys lisätty")}, 
			401: function() { $("#postoutput").html("Ei käyttöoikeutta")}, 
			404: function() { $("#postoutput").html("Käyttäjää tai viestiä ei ole olemassa")}, 
			500: function(data) { $("#postoutput").html("Server error: " + data["error"])}
		}
	});
}

function removeLike() {
	var id = document.getElementById("postid-removelike").value;
	var username = document.getElementById("username-removelike").value
	$.ajax({
		type: "DELETE", 
		url: 'http://localhost:3000/api/user/' + username + '/likes/' + id,
		dataType: 'json',
		statusCode: { 
			200: function() { $("#postoutput").html("Tykkäys poistettu")}, 
			401: function() { $("#postoutput").html("Ei käyttöoikeutta")}, 
			404: function() { $("#postoutput").html("Käyttäjää tai viestiä ei ole olemassa")}, 
			500: function(data) { $("#postoutput").html("Server error: " + data["error"])}
		}
	});
}
