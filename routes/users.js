var user_profile = require('mongoose').model('user_profile');
var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res) {
	user_profile.find(function(err, users){
		//console.log(req.session.username);
		for(var index in users){
			//console.log(users[index].user_name);
			var user = users[index];
			if(user.user_name == req.session.username){
				console.log('same');
				res.render('user', {title: 'User' , logged: req.session.iflogin , username: req.session.username , user_info: user});
				res.end();
				return;
			}
		}
	});
});

module.exports = router;
