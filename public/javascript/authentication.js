$(document).ready(function() {
	
	$("#login").submit(function(e) {
		e.preventDefault();
		e.returnValue = false;

		$.ajax({
			type: "POST", 
			url: 'http://localhost:3000/login', 
			data: $("#login").serialize(),
			dataType: 'json', 
			statusCode: {
				200:function() { /*asioita*/ window.location.reload(); }, 
				400:function() { alert("Kirjautuminen epäonnistui"); }, 
				401: function() { alert("Kirjautuminen epäonnistui"); }
			}
		});
	});
});
