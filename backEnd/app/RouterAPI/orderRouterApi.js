var express = require("express");
var Order = require("./../model/order");
var nodemailer = require("nodemailer");
var Pet = require("./../model/pet");
var Account = require("./../model/account");
const Nexmo = require("nexmo");
const apiRouterOrder = express.Router();

//key ma
const nexmo = new Nexmo({
  apiKey: "d30d82042",
  apiSecret: "SEm7ChamyASe8YB2r"
});

apiRouterOrder
  .route("/orders")
  .post((req, res) => {
    var order = new Order({
      id_user: req.body.id_user,
      userImage: req.body.userImage,
      name: req.body.name,
      listProduct: req.body.listProduct,
      handle: false,
      message: "Order is being processed"
    });
    Order.collection.insertOne(order, err => {
      if (err) {
        if (err.code === 11000) {
          return res.json({
            success: false,
            message: "A order with that name has already existed!"
          });
        } else {
          res.send(err);
        }
      }
      res.json({
        message: "order created!"
      });
    });
  })
  .get((req, res) => {
    Order.find((err, orders) => {
      return res.json(orders);
    });
  });

apiRouterOrder.route("/orders/own/:id_user").get((req, res) => {
  Order.find({ id_user: req.params.id_user }, (err, orders) => {
    return res.json(orders);
  });
});

apiRouterOrder
  .route("/orders/:id_order")
  .get((req, res) => {
    Order.findById(req.params.id_order).exec((err, order) => {
      if (err) {
        res.send(err);
      } else {
        res.json(order);
      }
    });
  })
  .put((req, res) => {
    Order.findById(req.params.id_order).exec((err, order) => {
      if (err) {
        res.send(err);
      } else {
        if (req.body.handle != null) {
          order.handle = req.body.handle;
        }
        if (req.body.message != null) {
          order.message = req.body.message;
        }
        Order.updateOne({ _id: req.params.id_order }, order, err => {
          if (err) {
            res.send(err);
          } else {
            if (order.handle === true) {
              // tat mua nhung pet trong gio hang
              order.listProduct.forEach((product,index) => {
                Pet.findById(product._id).exec((err, pet) => {
                  pet.exist = false;
                  Pet.updateOne({ _id: product._id }, pet, err => {
                    if (err) {
                      res.send(err);
                    } else {
                     
                      if(order.listProduct.length - 1 === index) {
                         //gui thong bao
                      Account.findById(order.id_user).exec((err, account) => {
                        //gui mail
                        if (account.email) {
                          sendMail(account.email, `Chào ${account.name}! Đơn hàng #${order.id.substring(1,6)} của bạn đã được xác nhận ! Của hàng sẽ liên lạc với bạn để hẹn lịch đến xem và nhận pet bạn nhé ! `);
                        }
                        //gui SMS
                        if (account.phone) {
                          sendSMS(account.phone, `Hi ! Your #${order.id.substring(1,6)} order has been approved, we will contact with you soon  !`);
                        }
                      })
                      return res.json({
                        message: "order updated!"   
                      });
                      }
                    }
                  });
                });
              });
            } else {
              res.send('Approved !')
            }
          }
        });
      }
    });
  })
  .delete((req, res) => {
    Order.remove({ _id: req.params.id_order }).exec((err, order) => {
      if (err) {
        res.send(err);
      } else {
        res.json({
          message: "Delete successfully!"
        });
      }
    });
  });

var sendMail = (email, message) => {
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "petshop16110052@gmail.com",
      pass: "datvu123"
    }
  });

  var mailOptions = {
    from: "petshop16110052@gmail.com",
    to: email,
    subject: "Confirm Pet Purchase",
    text: message
  };

  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

var sendSMS = (phone, message) => {
  const from = "PetShop";
  const to = phone;
  const text = message;

  nexmo.message.sendSms(from, to, text, (err, responseData) => {
    if (err) {
      console.log(err);
    } else {
      if (responseData.messages[0]["status"] === "0") {
        console.log("Message sent successfully.");
      } else {
        console.log(
          `Message failed with error: ${responseData.messages[0]["error-text"]}`
        );
      }
    }
  });
};

module.exports = apiRouterOrder;
