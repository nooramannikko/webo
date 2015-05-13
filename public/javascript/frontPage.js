$(document).ready(function() {
	$("#loadsettings").click(function(e) {
		e.preventDefault();
		e.returnValue = false;

		loadSettingsPage();
	});

	$("#login").submit(function(e) {
		e.preventDefault();
		e.returnValue = false;

		$.ajax({
			type: "POST", 
			url: '/login', 
			data: $("#login").serialize(),
			dataType: 'json', 
			statusCode: {
				200:function() { /*asioita*/ window.location.reload(); }, 
				400:function() { alert("Kirjautuminen epäonnistui"); }, 
				401: function() { alert("Kirjautuminen epäonnistui"); }
			}
		});
	});

	$("#createnewblog").submit(function(e) {
		e.preventDefault();
		e.returnValue = false;

		$.ajax({
			type: "POST", 
			url: '/api/blog', 
			data: $("#createnewblog").serialize(),
			dataType: 'json', 
			statusCode: {
				201:function(data) { window.location.reload(); }, 
				400:function() { $("#newblog-success").html("Anna blogille nimi"); }, 
				500: function(data) { $("#newblog-success").html("Server error: " + data.error); }
			}
		});
	});

	$("#latestposts").html("Haetaan");
	$.ajax({
		type: "GET", 
		url: '/api/post/', 
		dataType: 'json', 
		statusCode: {
			200:function(data) { 
				if (data.length != 0 && typeof data[0] != 'undefined')
				{
					var content = "";
					for (var i = 0; i < data.length; i++)
					{
						content += "<a href='/post/" + data[i].id + "'><h3>" + data[i].title + "</h3></a>";
						content += "<p>Kirjoittanut: " + data[i].author + "<br>" + data[i].blog + "</p>";
					}
					$("#latestposts").html(content);
				}
				else
					$("#latestposts").html("Palvelussa ei ole vielä blogikirjoituksia " + data.length);
			}, 
			404:function() { $("#latestposts").html("Uusimpia blogikirjoituksia ei saatu haettua"); }, 
			500:function() { $("#latestposts").html("Uusimpia blogikirjoituksia ei saatu haettua"); }
		}
	});

	$("#blogsfollowed").html("Haetaan");
	$.ajax({
		type: "GET", 
		url: '/api/username', 
		dataType: 'json', 
		statusCode: {
			200:function(data) { getFollowedBlogs(data.username); }, 
			401:function() { $("#blogsfollowed").html("Et ole kirjautunut"); }
		}
	});

	$("#authoredblogs").html("Haetaan");
	$.ajax({
		type: "GET", 
		url: '/api/username', 
		dataType: 'json', 
		statusCode: {
			200:function(data) { getAuthoredBlogs(data.username); }, 
			401:function() { $("#authoredblogs").html("Et ole kirjautunut"); }
		}
	});
});



function loadSettingsPage() {
	$("#dynamiccontent").load("settings", function(res, status, xhr) {
		if (status == "error")
			$("#dynamiccontent").load("../../settings");
	});
}

function loadAccountPage() {
	$("#dynamiccontent").load("account", function(res, status, xhr) {
		if (status == "error")
			$("#dynamiccontent").load("../../account");
	});
}

function getAuthoredBlogs(username) {

	$.ajax({
		type: "GET",
		url: '/api/user/' + username + '/blogs',
		dataType: 'json',
		statusCode: {
			200:function(data) { 
				var blogIDs = [];
				var names = [];
				for (var i = 0; i < data.length; i++)
				{
					blogIDs.push(data[i].id);
				}
				getBlogNames(blogIDs, names, 0, displayAuthoredBlogs);
			},
			404:function() { $("#authoredblogs").html("Blogeja ei saatu haettua"); }
		},
	});

}

function displayAuthoredBlogs(blogIDs, names) {
	if (blogIDs.length != 0)
	{
		var content = '<ul>';
		for (var i = 0; i < blogIDs.length; i++)
		{
			content += '<li><a href="/blog/' + blogIDs[i] + '">' + names[i] + '</a></li>';
		}
		content += '</ul>';
		$("#authoredblogs").html(content); 
	}
	else
		$("#authoredblogs").html("Et vielä seuraa yhtään blogia");
}

function getFollowedBlogs(username) {

	$("#blogsfollowed").html("Haetaan blogeja käyttäjälle: " + username); 

	$.ajax({
		type: "GET",
		url: '/api/user/' + username + '/follows',
		dataType: 'json',
		statusCode: {
			200:function(data) { 
				if (data.length != 0 && typeof data[0] != 'undefined')
				{
					var blogIDs = [];
					var names = [];
					for (var i = 0; i < data.length; i++)
					{
						blogIDs.push(data[i].id);
					}
					getBlogNames(blogIDs, names, 0, displayFollowedBlogs);
				}
				else
					$("#blogsfollowed").html("Et vielä seuraa yhtään blogia");
			},
			304:function() { $("#blogsfollowed").html("Et vielä seuraa yhtään blogia"); },
			404:function() { $("#blogsfollowed").html("Seurattuja blogeja ei saatu haettua"); }, 
			500:function() { $("#blogsfollowed").html("Seurattuja blogeja ei saatu haettua"); }
		},
	});

}

function getBlogNames(blogIDs, names, index, next) {

	// Jos kaikki nimet haettu
	if (index >= blogIDs.length) {
		next(blogIDs, names);
	}

	// Hae lisää nimiä
	else {
		$.ajax({
			type: "GET", 
			url: '/api/blog/' + blogIDs[index], 
			dataType: 'json', 
			statusCode: {
				200: function(data) {
					names.push(data.name); 
					getBlogNames(blogIDs, names, index+1, next);
				}, 
				404:function() {
					names.push("Nimi tuntematon");
					getBlogNames(blogIDs, names, index+1, next);
				}
			}
		});
	}
}

function displayFollowedBlogs(blogIDs, names) {

	//$("#blogsfollowed").html(blogIDs.length + " " + names.length); 
	if (blogIDs.length != 0)
	{
		var content = '<ul>';
		for (var i = 0; i < blogIDs.length; i++)
		{
			content += '<li><a class="blogpage" href="/blog/' + blogIDs[i] + '">' + names[i] + '</a></li>';
		}
		content += '</ul>';
		$("#blogsfollowed").html(content); 
	}
	else
		$("#blogsfollowed").html("Et vielä seuraa yhtään blogia");
}
