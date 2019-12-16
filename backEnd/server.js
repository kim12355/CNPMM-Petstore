
var express = require("express"); //	call express
var app = express(); //	define our app usỉng express
var bodyParser = require("body-parser"); //	get body-parser
var morgan = require("morgan"); //	used to see requests
var mongoose = require("mongoose");
var port = process.env.PORT || 8080; // set the port for our app


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(function(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type,	Authorization"
  );
  next();
});

app.use(morgan("dev"));

app.listen(port);
console.log("Port can dung la: " + port);

mongoose.Promise = global.Promise;
mongoose.connect(
  "mongodb://localhost:27017/PetShop",
  { useNewUrlParser: true, useUnifiedTopology: true },
  err => {
    if (!err) {
      console.log("MongoDB connect successfull.");
    } else {
      console.log(
        "Error in database connection: " + JSON.stringify(err, undefined, 2)
      );
    }
  }
);
mongoose.set("createIndexes", true);

app.get("/", (req, res) => {
});

var loginRouterApi = require('./app/RouterAPI/loginRouterApi');
var accountRouterApi = require('./app/RouterAPI/accountRouterApi');
var petRouterApi = require('./app/RouterAPI/petRouterApi');
var staffRouterApi = require('./app/RouterAPI/staffRouterApi');
var customerRouterApi = require('./app/RouterAPI/customerRouterApi');
var orderRouterApi = require('./app/RouterAPI/orderRouterApi');

app.use("/api", loginRouterApi);
app.use("/api/petshop", accountRouterApi);
app.use("/api/petshop", petRouterApi);
app.use("/api/petshop", staffRouterApi);
app.use("/api/petshop", customerRouterApi);
app.use("/api/petshop", orderRouterApi);