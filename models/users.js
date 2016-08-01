var bcrypt = require('bcryptjs');
var _ = require('underscore');
module.exports = function(sequelize, Datatypes) {
	var user = sequelize.define('users', {
		email: {
			type: Datatypes.STRING,
			allowNull: false,
			unique: true,
			validate: {
				isEmail: true
			}
		},
		salt: {
			type: Datatypes.STRING
		},
		password_hash: {
			type: Datatypes.STRING
		},
		password: {
			type: Datatypes.VIRTUAL,
			allowNull: false,
			validate: {
				len: [5, 8]
			},
			set: function(value) {
				var salt = bcrypt.genSaltSync(10);
				var hashedPassword = bcrypt.hashSync(value, salt);
				this.setDataValue('password', value);
				this.setDataValue('password_hash', hashedPassword);
				this.setDataValue('salt', salt);
			}
		}
	}, {
		hooks: {
			beforeValidate: function(user, options) {
				if (typeof user.email === 'string') {
					user.email = user.email.toLowerCase();
				}

			}
		},
		classMethods: {
			authenticate: function(body) {
				return new Promise(function(resolve, reject) {
					if (typeof body.email !== 'string' || typeof body.password !== 'string') {
						return reject();
					}
					user.findOne({
						where: {
							email: body.email
						}
					}).then(function(user) {
						if (!user || !bcrypt.compareSync(body.password, user.get('password_hash'))) {
							return reject();
						} else {
							resolve(user);
						}
					}, function(error) {
						reject();
					});
				});
			}
		},
		instanceMethods: {
			toPublicJSON: function() {
				var json = this.toJSON();
				return _.pick(json, 'id', 'email', 'createdAt', 'updatedAt');
			}
		}
	});
	return user;
};