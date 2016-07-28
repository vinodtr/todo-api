var express = require("express");
var bodyParser = require("body-parser");
var app = express();
var PORT = process.env.PORT || 3000;
var CONST = 300;
app.use(bodyParser.json());
var todos = [{
	id: 100,
	description:"Wash the vessels",
	completed:false
}, {
	id: 200,
	description:"Buy the groceries",
	completed:false
}, {
	id: 300,
	description:"Fold the clothes",
	completed:false
}];



app.get("/", function(request, response) {
	response.send("Welcome to Express Website !"); 
});

app.get("/todos", function(req, res) {
	res.json(todos);
});

app.get("/todos/:id", function(req, res) {
	var todoId = parseInt(req.params.id, 10);
	console.log(todoId);
	var result;
	todos.forEach(function(todo) {
		console.log('checking '+todo.id);
		if(todo.id === todoId) {
			console.log("match found");
			result = todo;
		}
	});

	if(result) {
		res.json(result);
	} else {
		console.log(result);
		res.status(404).send();
	}
});

app.post("/todos", function(req, res) {
	var body = req.body;
	console.log("description - " + body.description);
	var construct = {
		id: CONST + 54,
		description: body.description,
		completed: body.completed
	};
	todos.push(construct);
	res.json(todos);
});

app.listen(PORT, function() {
	console.log("Express listening on " + PORT)
});