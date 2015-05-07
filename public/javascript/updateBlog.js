function addUser() {

	var username = document.getElementById("usernametoadd").value;
	var id = document.URL;
	id = id.substr(id.lastIndexOf('/') + 1);

	$.ajax({
		type: "PUT", 
		url: 'http://localhost:3000/api/blog/' + id + '/author/' + username,
		dataType: 'json', 
		statusCode: {
			200: function() { $("#blogoutput").html("Kirjoitusoikeus lisätty"); }, 
			403: function() { $("#blogoutput").html("Oletusblogiin ei voida lisätä käyttäjiä"); }, 
			404: function() { $("#blogoutput").html("Käyttäjää tai blogia ei löydy"); }
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
			200: function() { $("#blogoutput").html("Kirjoitusoikeus poistettu"); }, 
			403: function() { $("#blogoutput").html("Oletusblogista ei voida poistaa käyttäjiä"); }, 
			404: function() { $("#blogoutput").html("Käyttäjää tai blogia ei löydy"); }
		}
	});
}