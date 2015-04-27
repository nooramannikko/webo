$(document).ready(function() {

	$("#createaccount").submit(function(e) {
		e.preventDefault();
		e.returnValue = false;
	
		var username = document.getElementById("accountuser").value;
		var name = document.getElementById("accountname").value;
		var password = document.getElementById("accountpassword").value;
		$.ajax({
			type: "POST",
			url: 'http://localhost:3000/api/user',
			data: {username: username, name: name, password: password}, 
			dataType: 'json',
			statusCode: {
				201:function() { $("#dynamiccontent").html("Käyttäjätunnus luotu onnistuneesti."); },
				400:function() { $("#account-success").html("Tarkista, että käyttäjätunnus, nimi ja salasana on annettu oikeellisesti."); }, 
				409:function() { $("#account-success").html("Käyttäjätunnus " + username +  " on jo käytössä"); }
			},
		});
	});
});

function loadAccountPage() {
	$("#dynamiccontent").load("account");
}