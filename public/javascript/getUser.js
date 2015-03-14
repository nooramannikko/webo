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
});
