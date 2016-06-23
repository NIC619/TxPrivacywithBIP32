var user_profile = require('mongoose').model('user_profile');
var express = require('express');
var router = express.Router();

var username = '';

//測試使用者登入
router.get('/' , function(req , res){
	//user_profile.find().remove().exec();
	//console.log("user login");
	if(req.session.iflogin){
		//res.send('user already login!');
		//setTimeout(function(){
		res.redirect('/');
		res.end();
		//	} , 1000);
		return;
	}

	res.render('login', {title : "Log in", logged: false, msg: ''});
});

//處理登入
router.post('/login' , function(req , res){

	user_profile.find(function(err , users){
		for(var index in users){
			var user = users[index];
			//console.log(user.user_name);
			//console.log(user.password);
			//console.log(user.email);
			if(req.body.username == user.user_name){
				if(req.body.password == user.password){
					//username = req.body.username;
					req.session.iflogin = true;
					//res.render('index' , {title : 'Express' , logged : true , username : username});
					req.session.username = req.body.username;
					res.redirect('/');
					res.end();
					return;
				}
				else{
					req.session.iflogin = false;
					req.session.username = '';
					res.render('login' , {title : "Log in" , logged: false , msg : 'Wrong password!'});
					res.end();
					return;
				}
			}
		}
		req.session.iflogin = false;
		req.session.username = '';
		res.render('login' , {title : "Log in" , logged: false , msg : "No Such User , Please Register!"});
		res.end();
	});

	
});
//登出
router.get('/logout' , function(req , res){
	//username = 'user name loading error';
	req.session.iflogin = false;
	req.session.username = '';
	res.redirect('/');
	//res.render('index' , {title : 'Express' , logged : false , username : ''});
	res.end();
});
//註冊
router.get('/register' , function(req , res){
	/*
	if(req.session.iflogin){
		res.redirect('/');
		res.end();
	}
	else{
		res.render('register' , {title : "Register" , msg: ''});
		res.end();
	}
	*/
	res.render('register' , {title : "Register" , logged: false , msg: ''});
});
router.post('/register' , function(req , res){
	user_profile.find(function(err , users){
		for(var index in users){
			var usr = users[index];
			//console.log(req.body.username);
			//console.log(usr.user_name);
			//console.log(usr.password);
			//console.log(usr.email);
			//user_profile.remove({user_name : 'nic' } , function(err){return;});
			if(req.body.username == usr.user_name){
				req.session.iflogin = false;
				req.session.username = '';
				res.render('register', {title : "Register" , logged: false , msg : 'Invalid user name or user name already in use!'});
				res.end();
				return;
			}
		}
		var user = new user_profile();
		user.user_name = req.body.username;
		user.password = req.body.password;
		var s = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
		user.fix_address = '1' + Array(33).join().split(',').map(function() { return s.charAt(Math.floor(Math.random() * s.length)); }).join('');;
		user.save();
		//username = req.body.username;
		req.session.iflogin = true;
		req.session.username = req.body.username;
		//res.render('index' , {title : 'Express' , logged : true , username : username});
		res.redirect('/');
		res.end();
	});
});

module.exports = router;