function deleteBlog() {
	var id = document.getElementById("deleteblog-id").value;
	$.ajax({
		type: "DELETE", 
		url: 'http://localhost:3000/api/blog/' + id,
		dataType: 'json',
		statusCode: { 
			200: function() { $("#deleteblogoutput").html("Blogi poistettu")}, 
			403: function() { $("#deleteblogoutput").html("Oletusblogia ei voida poistaa")}, 
			404: function() { $("#deleteblogoutput").html("Blogia ei ole olemassa")}
		}
	});
}
