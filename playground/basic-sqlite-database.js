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

var User = sequelize.define("user", {
	email: Sequelize.STRING
});

Todo.belongsTo(User);
User.hasMany(Todo);

sequelize.sync({
	force: false
}).then(function() {
	console.log("Everything is in Sync");

	/*Todo.create({
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

	});*/
	User.findAll({
		where: {
			this.completed: true
		}
	}).then(function(user) {
		if (user) {
			var todos = user.getTodos();
			todos.forEach(function(todo) {
				console.log(todo);
			})
		} else {
			User.findAll({
				where: {
					todo.completed: false
				}
			}).then(function(user) {
				if (user) {
					var todos = user.getTodos();
					todos.forEach(function(todo) {
						console.log(todo);
					})
				}
			})
		}
	})

	/*User.create({
		email: "andrew@gmail.com"
	}).then(function() {
		return Todo.create({
			description: "Throw the trash",
			completed: false
		}).then(function(todo) {
			User.findById(1).then(function(user) {
				user.addTodo(todo);
			})
		})
	});*/

}).catch(function(error) {
	console.log(error);
});