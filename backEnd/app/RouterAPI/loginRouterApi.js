var express = require("express");
var Account = require("./../model/account");
var jwt = require("jsonwebtoken");
var superSecret = "webquanlythucung";
var apiRouterLogin = express.Router();
// route to authenticate a account (POST http://localhost:8080/api/authenticate)
apiRouterLogin.post("/login", function(req, res) {
  // find the Account

  function createToken(account) {
    var token = jwt.sign(
      {
        id: account.id,
        name: account.name,
        username: account.username,
        role: account.role
      },
      superSecret,
      {
        expiresIn: "24h" // expires in 24 hours
      }
    );
    res.json({
      success: true,
      message: "dang nhap thanh cong",
      token: token
    });
  }

  Account.findOne({
    username: req.body.username
  })
    .select("name provider role username password lock")
    .exec(function(err, account) {
      if (err) throw err;
      // no Account with that username was found
      if (!account) {
        if (
          req.body.provider === "GOOGLE" ||
          req.body.provider === "FACEBOOK"
        ) {
          var account = new Account({
            name: req.body.name,
            provider: req.body.provider,
            email: req.body.email,
            username: req.body.username,
            password: req.body.password,
            image: req.body.image
          });
          account.save(err => {
            if (err) {
              res.send(err);
            } else {
              createToken(account);
            }
          });
        } else {
          res.json({
            success: false,
            message: "Tài khoản không tồn tại."
          });
        }
      } else {
        if (!account.lock) {
          
          // check if password matches
          var validPassword = account.comparePassword(req.body.password);
          if (validPassword || (account.provider === req.body.provider && req.body.provider)) {
            // if User is found and password is right // create a token
            createToken(account);
          } else {
            res.json({
              success: false,
              message: "Authentication tailed. Wrong password."
            });
          }
        }else{
          res.send({
            success:false,
            message:"Account Locked"
          })
        }
      }
    });
});

apiRouterLogin.post("/register", (req, res) => {
  var account = new Account({
    name: req.body.name,
    email: req.body.email,
    username: req.body.username,
    password: req.body.password
  });

  // Account.collection.insertOne(account, err => {
  account.save(err => {
    if (err) {
      if (err.code === 11000) {
        return res.json({
          success: false,
          message: "A account with that username has already existed!"
        });
      } else {
        res.send(err);
      }
    }
    res.json({
      success: true,
      message: "Account created!"
    });
  });
});

apiRouterLogin.post("/logout", function(req, res) {
  var token =
    req.body.token || req.query.token || req.headers["x-access-token"];
  if (token) {
  } else {
    // ỉf there ỉs no token
    // return an HTTP response of 403 (access torbidden) and an error message
    return res
      .status(403)
      .send({ success: false, message: "No token provided." });
  }
});

apiRouterLogin.use("/petshop", function(req, res, next) {
  // check header or url parameters or post parameters for token
  var token =
    req.body.token || req.query.token || req.headers["x-access-token"];

  // decode token
  if (token) {
    // verifies secret and checks exp
    jwt.verify(token, superSecret, function(err, decoded) {
      if (err) {
        return res.json({
          success: false,
          message: "Failed to authenticate token."
        });
      } else {
        // if everythỉng is good, save to request for use in other routes
        req.decoded = decoded;
        next(); // make sure we go to the next routes and don't stop here
      }
    });
  } else {
    // ỉf there ỉs no token
    // return an HTTP response of 403 (access torbidden) and an error message
    return res
      .status(403)
      .send({ success: false, message: "No token provided." });
  }
});
module.exports = apiRouterLogin;
