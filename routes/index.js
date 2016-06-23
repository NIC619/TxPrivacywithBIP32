var paycode = require('mongoose').model('paycode');
var express = require('express');
var router = express.Router();
var exec =require('child_process').exec;
/* GET home page. */
router.get('/', function(req, res) {
	//paycode.find().remove().exec();
	paycode.find(function(err, codes){
		res.render('index', {title: 'Code List', logged: req.session.iflogin, username: req.session.username, codelist: codes.reverse()});
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
	var code = new paycode();
	var paycodes={username:'', fix_address:'', pay_code:'', secret_key:'', priv_key:''};
	var cmd = 'python get_payment_code.py ' + req.body.random_number;
	const child = exec(cmd,
	  (error, stdout, stderr) => {
	  	stdout = JSON.parse(stdout);
	    console.log('stdout: ', stdout);
	    //console.log('stderr: ', stderr);
	    if (error !== null) {
	      //console.log('exec error: ', error);
	      res.render('paycode', {title: "Pay Code", logged: req.session.iflogin , username: req.session.username , paycodes: paycodes , msg: error});
	      res.end();
	    }
	    else{
	    	paycodes.username = req.body.username;
			paycodes.fix_address = req.body.fix_address;
			paycodes.pay_code = stdout.paymentCode;
	    	paycodes.secret_key = stdout.dhSecret;
	    	paycodes.priv_key = stdout.xprv;
	    	
	    	code.username = req.body.username;
			code.fix_address = req.body.fix_address;
			code.pay_code = stdout.paymentCode;
			code.save();
	    	res.render('paycode', {title: "Pay Code", logged: req.session.iflogin , username: req.session.username , paycodes: paycodes , msg:'This is your paycode, please memerize the secret key and private key'});
		}
	});
});

router.get('/apply', function(req, res){
	paycode.find(function(err, codes){
		for(var index in codes){
			var code = codes[index];
			if(code.pay_code == req.query.pay_code){
				res.render('apply', {title: "Apply", logged: req.session.iflogin , username: req.session.username , paycodes: code , msg: ''});
				return;
			}
		}
	});
});

router.post('/apply', function(req, res) {
	paycode.find(function(err, codes){
		for(var index in codes){
			var code = codes[index];
			if(code.pay_code == req.body.pay_code){
				var cmd = 'python get_address.py "' + req.body.pay_code + '" ' + req.body.secret_key + req.body.nonce;
				//console.log("cmd: " + cmd);
				const child = exec(cmd,
				  (error, stdout, stderr) => {
				  	stdout = JSON.parse(stdout);
				    console.log('stdout: ', stdout);
				    //console.log('stderr: ', stderr);
				    if (error !== null) {
				      //console.log('exec error: ', error);
				      res.render('apply', {title: "Apply", logged: req.session.iflogin , username: req.session.username , paycodes: code , msg: error});
				      res.end();
				    }
				    else{
				    	res.render('apply', {title: "Apply", logged: req.session.iflogin , username: req.session.username , paycodes: code , msg:'Receiving Address : ' + stdout.addr});
						res.end();
					}
				});
				return;
			}
		}
	});
});

router.get('/getpriv', function(req, res){
	var dh_public = req.query.pay_code.split('||')[1];
	paycode.find(function(err, codes){
		for(var index in codes){
			var code = codes[index];
			if(code.pay_code == req.query.pay_code){
				res.render('getpriv', {title: "Get Private Key", logged: req.session.iflogin , username: req.session.username , paycodes: code , dh: dh_public , msg: ''});
				return;
			}
		}
	});
});

router.post('/getpriv', function(req, res){
	paycode.find(function(err, codes){
		for(var index in codes){
			var code = codes[index];
			if(code.pay_code == req.body.pay_code){
				var cmd = 'python get_privkey.py ' + req.body.private_key + ' ' + req.body.secret_key + req.body.nonce + ' ' + req.body.dh;
				//console.log("cmd: " + cmd);
				const child = exec(cmd,
				  (error, stdout, stderr) => {
				  	stdout = JSON.parse(stdout);
				    console.log('stdout: ', stdout);
				    //console.log('stderr: ', stderr);
				    if (error !== null) {
				      //console.log('exec error: ', error);
				      res.render('getpriv', {title: "Get Private Key", logged: req.session.iflogin , username: req.session.username , paycodes: code , dh: req.body.dh , msg: error});
				      res.end();
				    }
				    else{
				    	res.render('getpriv', {title: "Get Private Key", logged: req.session.iflogin , username: req.session.username , paycodes: code , dh: req.body.dh  , msg:'Private Key for this address: ' + stdout.privkey});
						res.end();
					}
				});
				return;
			}
		}
	});
});

module.exports = router;
