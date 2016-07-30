module.exports = function(sequelize, Datatypes) {
	return sequelize.define('users', {
		email: {
			type: Datatypes.STRING,
			allowNull: false,
			unique: true,
			validate: {
				isEmail: true
			}
		},
		password: {
			type: Datatypes.STRING,
			allowNull: false,
			validate: {
				len: [5, 8]
			}
		}
	}, {
		hooks: {
			beforeValidate: function(user, options) {
				if (typeof user.email === 'string') {
					user.email = user.email.toLowerCase();
				}

			}
		}
	});
};