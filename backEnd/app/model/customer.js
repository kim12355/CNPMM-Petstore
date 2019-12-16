var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var CustomerSchema = new Schema({
  name: { type: String, required: true, index: { unique: true } },
  birthday: { type: Date, required: true},
  address: { type: String, required: true},
  phone: { type: String, required: true},
  rank: { type: String, required: true}
});

module.exports = mongoose.model("Customer", CustomerSchema);
