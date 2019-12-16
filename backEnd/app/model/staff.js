var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var StaffSchema = new Schema({
  name: { type: String, required: true, index: { unique: true } },
  birthday: { type: Date, required: true},
  address: { type: String, required: true},
  phone: { type: String, required: true},
  image: { type: String, required: true}
});

module.exports = mongoose.model("Staff", StaffSchema);
