var tx = require('mongoose').model('tx');
var express = require('express');
var router = express.Router();
var exec =require('child_process').exec;
/* GET home page. */
router.get('/', function(req, res) {
	//tx.find().remove().exec();
	tx.find(function(err, tx){
		res.render('tx', {title: 'Transaction', logged: req.session.iflogin, username: req.session.username, txlist: tx.reverse()});
	});
	/*
	if(req.session.logined){
  		res.render('index', { title: 'Express' , logged : true , username : req.session.username });
	}
	else
		res.render('index' , {title: 'Express' , logged : false , username : 'Guest'});
	*/
});

router.post('/', function(req, res) {
	var new_tx = new tx();
	new_tx.type = req.body.type;
	new_tx.sender = req.body.sender;
	new_tx.receiver = req.body.receiver;
	new_tx.content = req.body.content;
	new_tx.save();
	res.redirect('/');
	/*
	tx.find(function(err, tx){
		res.render('tx', {title: 'Transaction', logged: req.session.iflogin, username: req.session.username, txlist: tx.reverse()});
	});
	*/
});


module.exports = router;
