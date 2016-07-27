var express = require("express");
var app = express();
var PORT = process.env.PORT || 3000;

app.get("/", function(request, response) {
	response.send("Welcome to Express Website !"); 
});
app.listen(PORT, function() {
	console.log("Express listening on " + PORT)
})