var express = require("express");
var bodyParser = require("body-parser");
var bcrypt = require("bcryptjs");
var _ = require("underscore");
var db = require("./db.js");
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
	var where = {};
	if (queryParams.hasOwnProperty("completed") && completedParam && completedParam.trim() === 'true') {
		where.completed = true;
	} // false items
	else if (queryParams.hasOwnProperty("completed") && completedParam && completedParam.trim() === 'false') {
		where.completed = false;
	}

	if (queryParams.hasOwnProperty("q") && queryParams.q.length > 0) {
		where.description = {
			$like: '%' + queryParams.q + '%'
		};
	}

	db.todo.findAll({
		where: where
	}).then(function(todos) {
		res.json(todos);
	}, function(error) {
		res.status(500).send();
	});
	/*console.log(completedParam);
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

	res.json(result);*/
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
	db.todo.findById(todoId).then(function(todo) {
		if (todo) {
			res.json(todo.toJSON());
		} else {
			res.status(404).send();
		}
	}, function(error) {
		res.status(500).send();
	});
	/*var result = _.findWhere(todos, {
		id: todoId
	});*/
});

//


app.delete("/todos/:id", function(req, res) {
	var todoId = parseInt(req.params.id, 10);
	db.todo.destroy({
		where: {
			id: todoId
		}
	}).then(function(deleted) {
		if (deleted == 0) {
			res.status(404).send({
				error: "No matching element found"
			})
		} else {
			res.status(204).send();
		}
	}, function(error) {
		res.status(500).send();
	});
});


app.put("/todos/:id", function(req, res) {
	var todoId = parseInt(req.params.id, 10);
	var body = _.pick(req.body, 'description', 'completed');
	/*var matchedTodo = _.findWhere(todos, {
		id: todoId
	});*/
	var validAttributes = {};

	/*if (!matchedTodo) {
		console.log("1");
		return res.status(404).send();
	}*/

	if (body.hasOwnProperty("completed")) { // && _.isBoolean(body.completed)) {
		validAttributes.completed = body.completed;
	}
	/*else if (body.hasOwnProperty("completed")) {
		console.log("2");
		return res.status(400).send();
	}*/

	if (body.hasOwnProperty("description")) { //&& _.isString("description") && body.description.trim().length > 0) {
		validAttributes.description = body.description;
	}
	/*else if (body.hasOwnProperty("description")) {
		console.log("3");
		return res.status(400).send();
	}*/

	// _.extend(matchedTodo, validAttributes);
	// res.json(matchedTodo);
	db.todo.findById(todoId).then(function(todo) {
		// if matching element is present
		if (todo) {
			todo.update(validAttributes).then(function(todo) {
				res.json(todo.toJSON());
			}, function(error) {
				res.status(400).json(error);
			});;
		} else {
			res.status(404).send();
		}
	}, function(error) {
		res.status(500).send();
	});
});

app.post("/todos", function(req, res) {
	var body = _.pick(req.body, 'description', 'completed');
	db.todo.create(body).then(function(todo) {
		console.log("Entry inserted in the database");
		res.json(todo.toJSON());
	}).catch(function(error) {
		console.log("Error has occurred");
		res.status(404).json(error);
	});

	/*console.log("description - " + body.description);
	console.log('Before cleaning ' + JSON.stringify(body));
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
	}*/


});

// add a user
app.post("/users", function(req, res) {
	var body = _.pick(req.body, 'email', 'password');
	db.users.create(body).then(function(user) {
		res.json(user.toPublicJSON());
	}, function(error) {
		res.status(400).json(error);
	});
});

app.post("/users/login", function(req, res) {
	var body = _.pick(req.body, 'email', 'password');
	db.users.authenticate(body).then(function(user) {
		var token = user.generateToken('authentication');
		if(token) {
			res.header('Auth', token).json(user.toPublicJSON());	
		} else {
			res.status(401).send();	
		}
		
	}, function(error) {
		res.status(401).send();
	});

	/*if (typeof body.email !== 'string' || typeof body.password !== 'string') {
		return res.status(400).send();
	}
	db.users.findOne({
		where: {
			email: body.email
		}
	}).then(function(user) {
		console.log(bcrypt.compareSync(body.password, user.get('password_hash')));
		if (!user || !bcrypt.compareSync(body.password, user.get('password_hash'))) {
			return res.status(401).send();
		} else {
			res.json(user.toPublicJSON());
		}
	}, function(error) {
		res.status(500).send();
	});*/



});

db.sequelize.sync().then(function() {
	app.listen(PORT, function() {
		console.log("Express listening on " + PORT)
	});
});