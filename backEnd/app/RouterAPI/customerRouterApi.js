var express = require("express");
var Customer = require("./../model/customer");
const apiRouterCustomer = express.Router();

apiRouterCustomer
  .route("/customers")
  .post((req, res) => {
    var customer = new Customer({
      name: req.body.name,
      birthday: req.body.birthday,
      address: req.body.address,
      phone: req.body.phone,
      image: req.body.rank
    });
    Customer.collection.insertOne(customer, err => {
      if (err) {
        if (err.code === 11000) {
          return res.json({
            success: false,
            message: "A customer with that name has already existed!"
          });
        } else {
          res.send(err);
        }
      }
      res.json({
        message: "customer created!"
      });
    });
  })
  .get((req, res) => {
    Customer.find((err, customers) => {
      return res.json(customers);
    });
  });

apiRouterCustomer
  .route("/customers/:customer_id")
  .get((req, res) => {
    Customer.findById(req.params.customer_id).exec((err, customer) => {
      if (err) {
        res.send(err);
      } else {
        res.json(customer);
      }
    });
  })
  .put((req, res) => {
    Customer.findById(req.params.customer_id).exec((err, customer) => {
      if (err) {
        res.send(err);
      } else {
        if (req.body.name) {
          customer.name = req.body.name;
        }
        if (req.body.birthday) {
          customer.birthday = req.body.birthday;
        }
        if (req.body.address) {
          customer.address = req.body.address;
        }
        if (req.body.gender) {
          customer.phone = req.body.phone;
        }
        if (req.body.rank) {
          customer.rank = req.body.rank;
        }
        Customer.updateOne({ _id: req.params.customer_id }, customer, err => {
          if (err) {
            res.send(err);
          } else {
            res.json({
              message: "Customer updated!"
            });
          }
        });
      }
    });
  })
  .delete((req, res) => {
    Customer.remove({ _id: req.params.customer_id }).exec((err, customer) => {
      if (err) {
        res.send(err);
      } else {
        res.json({
          message: "Delete successfully!"
        });
      }
    });
  });

apiRouterCustomer.route("/customers/search/:customer_name").get((req, res) => {
  Customer.find({ name: { $regex: req.params.customer_name, $options: "$i" } }).exec(
    (err, customer) => {
      if (err) {
        res.send(err);
      } else {
        res.json(customer);
      }
    }
  );
});

module.exports = apiRouterCustomer;
