var cryptojs = require("crypto-js");
module.exports = function(db) {
	return {
		requireAuthentication: function(req, res, next) {
			var token = req.get('Auth');
			// console.log(token);
			var tokenHash = cryptojs.MD5(token).toString();
			db.token.findOne({
				where: {
					tokenHash: tokenHash
				}
			}).then(function(tokenInstance) {
				if (!tokenInstance) {
					throw new Error();
				}
				req.token = tokenInstance;
				return db.users.findByToken(token);
			}).then(function(user) {
				req.user = user;
				next();
			}).catch(function(error) {
				console.error(error);
				res.status(401).send();
			});
		}
	};
}