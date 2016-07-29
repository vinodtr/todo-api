var express = require("express");
var bodyParser = require("body-parser");
var _ = require("underscore");
var app = express();
var PORT = process.env.PORT || 3000;
var CONST = 300;
app.use(bodyParser.json());
var todos = [{
	id: 100,
	description: "Wash the vessels",
	completed: false
}, {
	id: 200,
	description: "Buy the groceries",
	completed: false
}, {
	id: 300,
	description: "Fold the clothes",
	completed: false
}];



app.get("/", function(request, response) {
	response.send("Welcome to Express Website !");
});

app.get("/todos", function(req, res) {
	var queryParams = req.query;
	var completedParam = queryParams.completed;
	var result = todos;
	console.log(completedParam);
	// true items
	if (queryParams.hasOwnProperty("completed") && completedParam && completedParam.trim() === 'true') {
		result = _.where(todos, {
			completed: true
		});
	} // false items
	else if (queryParams.hasOwnProperty("completed") && completedParam && completedParam.trim() === 'false') {
		result = _.where(todos, {
			completed: false
		});
		console.log(JSON.stringify(todos));
	} // all items
	if (queryParams.hasOwnProperty("q")) {
		console.log('hereeeeee	');
		var descriptionParam = queryParams.q;
		result = _.filter(result, function(todo) {
			return todo.description.indexOf(descriptionParam) > -1;
		});
	}
	res.json(result);
});

/*app.get("/todos/:id", function(req, res) {
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
	} else {
		console.log(result);
		res.status(404).send();
	}
});*/
app.get("/todos/:id", function(req, res) {
	var todoId = parseInt(req.params.id, 10);
	var result = _.findWhere(todos, {
		id: todoId
	});

	if (result) {
		res.json(result);
	} else {
		console.log(result);
		res.status(404).send();
	}
});

//


app.delete("/todos/:id", function(req, res) {
	var todoId = parseInt(req.params.id, 10);
	var matchedTodo = _.findWhere(todos, {
		id: todoId
	});
	if (!matchedTodo) {
		res.send('No matching element found to be deleted');
	} else {
		todos = _.without(todos, matchedTodo);
		res.send('Element successfully removed');
	}
});

app.put("/todos/:id", function(req, res) {
	var todoId = parseInt(req.params.id, 10);
	var body = _.pick(req.body, 'description', 'completed');
	var matchedTodo = _.findWhere(todos, {
		id: todoId
	});
	var validAttributes = {};

	if (!matchedTodo) {
		console.log("1");
		return res.status(404).send();
	}

	if (body.hasOwnProperty("completed") && _.isBoolean(body.completed)) {
		validAttributes.completed = body.completed;
	} else if (body.hasOwnProperty("completed")) {
		console.log("2");
		return res.status(400).send();
	}

	if (body.hasOwnProperty("description") && _.isString("description") && body.description.trim().length > 0) {
		validAttributes.description = body.description;
	} else if (body.hasOwnProperty("description")) {
		console.log("3");
		return res.status(400).send();
	}

	_.extend(matchedTodo, validAttributes);
	res.json(matchedTodo);

});


app.post("/todos", function(req, res) {
	var body = req.body;
	console.log("description - " + body.description);
	console.log('Before cleaning ' + JSON.stringify(body));
	var cleanBody = _.pick(body, 'description', 'completed');
	console.log('After cleaning ' + JSON.stringify(cleanBody));

	if (!_.isString(body.description) || !_.isBoolean(body.completed)) {
		console.log("User input not correct");
		res.status(404).send();
	} else {
		var construct = {
			id: CONST + 54,
			description: body.description.trim(),
			completed: body.completed
		};
		todos.push(construct);
		res.json(todos);
	}


});

app.listen(PORT, function() {
	console.log("Express listening on " + PORT)
});