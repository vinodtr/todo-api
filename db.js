var Sequelize = require("sequelize");
var env = process.env.NODE_ENV || 'development';
var sequelize;

if (env === 'production') {
	sequelize = new Sequelize(process.env.DATABASE_URL, {
		'dialect': 'postgres'
	});
} else {
	sequelize = new Sequelize(undefined, undefined, undefined, {
		'dialect': 'sqlite',
		'storage': __dirname + '/data/basic-sqlite-database.sqlite'
	});
}

var db = {};
db.todo = sequelize.import(__dirname + '/models/todo.js');
db.users = sequelize.import(__dirname + '/models/users.js');
db.token = sequelize.import(__dirname + '/models/token.js');
db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.users.hasMany(db.todo);
db.todo.belongsTo(db.users);
module.exports = db;