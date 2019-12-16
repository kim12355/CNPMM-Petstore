var express = require("express");
var Staff = require("./../model/staff");
const apiRouterStaff = express.Router();

apiRouterStaff
  .route("/staffs")
  .post((req, res) => {
    var staff = new Staff({
      name: req.body.name,
      birthday: req.body.birthday,
      address: req.body.address,
      phone: req.body.phone,
      image: req.body.image
    });
    Staff.collection.insertOne(staff, err => {
      if (err) {
        if (err.code === 11000) {
          return res.json({
            success: false,
            message: "A staff with that name has already existed!"
          });
        } else {
          res.send(err);
        }
      }
      res.json({
        message: "staff created!"
      });
    });
  })
  .get((req, res) => {
    Staff.find((err, staffs) => {
      return res.json(staffs);
    });
  });

apiRouterStaff
  .route("/staffs/:staff_id")
  .get((req, res) => {
    Staff.findById(req.params.staff_id).exec((err, staff) => {
      if (err) {
        res.send(err);
      } else {
        res.json(staff);
      }
    });
  })
  .put((req, res) => {
    Staff.findById(req.params.staff_id).exec((err, staff) => {
      if (err) {
        res.send(err);
      } else {
        if (req.body.name) {
          staff.name = req.body.name;
        }
        if (req.body.birthday) {
          staff.birthday = req.body.birthday;
        }
        if (req.body.address) {
          staff.address = req.body.address;
        }
        if (req.body.gender) {
          staff.phone = req.body.phone;
        }
        if (req.body.image) {
          staff.image = req.body.image;
        }
        Staff.updateOne({ _id: req.params.staff_id }, staff, err => {
          if (err) {
            res.send(err);
          } else {
            res.json({
              message: "Staff updated!"
            });
          }
        });
      }
    });
  })
  .delete((req, res) => {
    Staff.remove({ _id: req.params.staff_id }).exec((err, staff) => {
      if (err) {
        res.send(err);
      } else {
        res.json({
          message: "Delete successfully!"
        });
      }
    });
  });

apiRouterStaff.route("/staffs/search/:staff_name").get((req, res) => {
  Staff.find({ name: { $regex: req.params.staff_name, $options: "$i" } }).exec(
    (err, staff) => {
      if (err) {
        res.send(err);
      } else {
        res.json(staff);
      }
    }
  );
});

module.exports = apiRouterStaff;
