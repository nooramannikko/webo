function updateUser() {

	var name = document.getElementById("newname").value;
	var password = document.getElementById("newpassword").value;

	$.ajax({
		// Hae autentikoitu käyttäjä
		type: "GET", 
		url: 'http://localhost:3000/api/username', 
		dataType: 'json', 
		statusCode: {
			200: function(data) { var username = data["username"];
				$.ajax({
					type: "PUT", 
					url: 'http://localhost:3000/api/user/' + username,
					dataType: 'json', 
					data: { name: name, password: password }, 
					statusCode: {
						200: function() { $("#updateuser-success").html("Tiedot päivitetty"); }, 
						400: function() { $("#updateuser-success").html("Tyhjä nimi tai salasana, ei voitu päivittää"); }, 
						404: function() { $("#updateuser-success").html("Käyttäjää ei löydy"); }, 
						500: function() { $("#updateuser-success").html("Päivittäminen epäonnistui");}
					}
				});
			}, 
			404: function(data) { $("#output").html("Ei käyttäjää"); }
		}
	});
}
/* turha??
function getUsername() {
	$.ajax({
		type: "GET", 
		url: 'http://localhost:3000/api/user/getuser', 
		dataType: 'json', 
		statusCode: {
			200:function(data) { $("#checkusername").html(data['username']); }, 
			500:function(data) { $("#checkusername").html(data['error']); }
		}
	});
}*/

function loadSettingsPage() {
	$("#dynamiccontent").load("settings");
}

$(document).ready(function() {
	$("#loadsettings").click(function(e) {
		e.preventDefault();
		e.returnValue = false;

		loadSettingsPage();
	});
});
