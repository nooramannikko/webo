function updateUser() {

	var username;
	var name = document.getElementById("newname").value;
	var password = document.getElementById("newpassword").value;
	$.ajax({
		// Hae autentikoitu käyttäjä
		type: "GET", 
		url: 'http://localhost:3000/api/user/getuser', 
		dataType: 'json', 
		statusCode: {
			200: function(data) { 
				username = data["username"];
				$.ajax({
					type: "PUT", 
					url: 'http://localhost:3000/api/user/' + username,
					dataType: json, 
					data: { name: name, password: password }, 
					statusCode: {
						200: function() { $("#output").html("Tiedot päivitetty"); }, 
						400: function() { $("#output").html("Tyhjä nimi tai salasana, ei voitu päivittää"); }, 
						404: function() { $("#output").html("Käyttäjää ei löydy"); }, 
						500: function() { $("#output").html("Päivittäminen epäonnistui");}
					}
				});
			}, 
			404: function(data) { $("#output").html("Ei käyttäjää"); }
		}
	});
}