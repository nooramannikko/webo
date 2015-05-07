$(document).ready(function() {
	
	$("#getblog").submit(function(e) {
		e.preventDefault();
		e.returnValue = false;
	
		var id = document.getElementById("getblog-blogid").value;
		$.ajax({
			type: "GET",
			url: 'http://localhost:3000/api/blog/' + id,
			dataType: 'json',
			statusCode: {
				200:function(data) { $("#blogoutput").html("id: " + data["id"] + "<br> name: " + data["name"]); },
				404:function() { $("#blogoutput").html("Haettua blogia ei löydy"); }
			},
		});
	});

	$("#getblogposts").submit(function(e) {
		e.preventDefault();
		e.returnValue = false;
	
		var id = document.getElementById("getpost-blogid").value;
		$.ajax({
			type: "GET",
			url: 'http://localhost:3000/api/blog/' + id + '/posts',
			dataType: 'json',
			statusCode: {
				200:function(data) { $("#blogoutput").html("Viestit haettu"); },
				404:function() { $("#blogoutput").html("Haettua blogia ei löydy"); }
			},
		});
	});

	$("#getsinglepost").submit(function(e) {
		e.preventDefault();
		e.returnValue = false;
	
		var id = document.getElementById("getpost-postid").value;
		$.ajax({
			type: "GET",
			url: 'http://localhost:3000/api/post/' + id,
			dataType: 'json',
			statusCode: {
				200:function(data) { $("#blogoutput").html("Viesti haettu"); },
				404:function() { $("#blogoutput").html("Haettua blogia ei löydy"); }
			},
		});
	});

	$("#newblogpost").submit(function(e) {
		e.preventDefault();
		e.returnValue = false;
		
		var id = document.getElementById("new-post-id").value;
		var data =  $("#newblogpost").serialize();
		$.ajax({
			type: "POST",
			url: 'http://localhost:3000/api/blog/' + id + '/posts',
			data: data,
			dataType: 'json',
			statusCode: {
				200:function(data) { $("#blogoutput").html("Viesti " + data["id"] + " tallennettu"); },
				400:function() { $("#blogoutput").html("Tietoja puuttuu"); },
				404:function(data) { $("#blogoutput").html(data["statusText"]); },
				500:function(data) { $("#blogoutput").html(data["responseText"]); }
			},
		});
	});

});


function avaablogi(url) {
	$("#dynamiccontent").load(url);

	var id = url.substring(6);

	$(document).ready(function() {       
		$.ajax({
			type: "GET",
			url: 'http://localhost:3000/api/blog/' + id + '/posts',
			dataType: 'json',
			statusCode: {
				200:function(data) { tulostaBloginTiedot(data); },
				404:function() { $("#blogin10kirjoitusta").html("Haettua blogia ei löydy"); }
			},
		});
    });
}

function tulostaBloginTiedot(data) {
	var div = document.getElementById('blogin10kirjoitusta');

	for(var i = data.length - 1; i >= 0; i--) {
		div.innerHTML += '<b>' + data[i].title + '</b><br>' + data[i].text + '<br>Kommentteja: ';

		$.ajax({
       		async: false,
			type: "GET",
			url: 'http://localhost:3000/api/post/' + data[i].id + '/comments',
			dataType: 'json',
			statusCode: {
				200:function(data) { div.innerHTML += data.length + ', Tykkäyksiä: '; },
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