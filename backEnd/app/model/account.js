var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var bcrypt = require("bcrypt-nodejs");

// full role
// role = {
//   pet:['see','add','remove','edit'],
//   account:['see','add','remove','edit'],
//   staff:['see','add','remove','edit']
// }


// Account schema
var AccountSchema = new Schema({
  name: String,
  provider: String,
  image: String,
  email: String,
  phone: String,
  address: String,
  role: {type: Array,default:
    ['PET_SEE']},
  lock:{type:Boolean,default:false},
  username: { type: String, required: true, index: { unique: true } },
  password: { type: String, required: true, select: false }
});

// hash the password before the Account is saved
AccountSchema.pre("save", function(next) {
  var account = this;
  // hash the password only ỉf the password has been changed or Account is new
  if (!account.isModified("password")) return next();
  // generate the hash    
  bcrypt.hash(account.password, null, null, function(err, hash) {
    if (err) return next(err);
    // change the password to the hashed version
    account.password = hash;
    next();
  });
});



// method to compare a given password with the database hash
AccountSchema.methods.comparePassword = function(password) {
  var account = this;
  return bcrypt.compareSync(password, account.password);
};

module.exports = mongoose.model("Account", AccountSchema);
