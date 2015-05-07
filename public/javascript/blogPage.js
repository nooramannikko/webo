$(document).ready(function() {

	var href = document.URL;
	href= href.substr(href.lastIndexOf('/') + 1);

	$.ajax({
		type: "GET",
		url: 'http://localhost:3000/api/blog/' + href + '/posts',
		dataType: 'json',
		statusCode: {
			200:function(data) { tulostaBloginTiedot(data); },
			404:function() { $("#blogin10kirjoitusta").html("Haettua blogia ei löydy"); }
		},
	});
});

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