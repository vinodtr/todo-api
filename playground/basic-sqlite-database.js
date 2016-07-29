var Sequelize = require("sequelize");
var sequelize = new Sequelize(undefined, undefined, undefined, {
	'dialect': 'sqlite',
	'storage': 'basic-sqlite-database.sqlite'
});

var Todo = sequelize.define("todo", {
	description: {
		type: Sequelize.STRING,
		allowNull: false,
		validate: {
			len: [1, 250]
		}
	},
	completed: {
		type: Sequelize.BOOLEAN,
		defaultValue: false
	}
});
sequelize.sync({
	force: true
}).then(function() {
	console.log("Everything is in Sync");

	Todo.create({
		description: "Walk the Tigers",
		completed: true
	}).then(function(todo) {
		return Todo.create({
			description: "Walk the Hippos"
		});
	}).then(function() {
		return Todo.findAll({
			where: {
				description: {
					$like: '%Ti%'
				}
			}
		});
	}).then(function(todos) {
		if (todos) {
			todos.forEach(function(todo) {
				console.log(todo.toJSON());
			});
		} else {
			console.log("No matching record found");
		}

	});


}).catch(function(error) {
	console.log(error);
});