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

	

	/**/

});






