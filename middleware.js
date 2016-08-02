module.exports = function(db) {
	return {
		requireAuthentication: function(req, res, next) {
			var token = req.get('Auth');
			console.log(token);
			db.users.findByToken(token).then(function(user) {
				req.user = user;
				next();
			}, function(e) {
				console.log(e);
				res.status(401).send();
			});
		}
	};
}