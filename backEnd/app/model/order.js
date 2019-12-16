var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var orderSchema = new Schema({ 
    id_user: String,
    userImage:String,
    name:String,
    listProduct: Array,
    date:  {type:Date,default: new Date().toLocaleString("vi", {
        hour: "numeric",
        minute: "numeric",
        weekday: "long",
        month: "long",
        day: "2-digit",
        year: "numeric"
    })},
    handle:Boolean,
    message:String
});

module.exports = mongoose.model('order',orderSchema);
