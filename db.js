var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var user_profile = new Schema({
		user_name : String,
		password  : String,
		fix_address 	  : String
});

var paycode = new Schema({
		username : String,
		fix_address : String,
		pay_code : String
});

var tx = new Schema({
		type : String,
		sender : String,
		receiver : String,
		content : String
});

mongoose.model('tx' , tx);
mongoose.model('user_profile' , user_profile);
mongoose.model('paycode' , paycode);
mongoose.connect('mongodb://localhost/txprivacywithbip32_database');