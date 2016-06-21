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

mongoose.model('user_profile' , user_profile);
mongoose.model('paycode' , paycode);
mongoose.connect('mongodb://localhost/txprivacywithbip32_database');