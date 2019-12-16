var express = require("express");
var Pet = require("./../model/pet");
const apiRouterPet = express.Router();

apiRouterPet
  .route("/pets")
  .post((req, res) => {
    var pet = new Pet({
      name: req.body.name,
      kind: req.body.kind,
      character: req.body.character,
      gender: req.body.gender,
      vaccineUpToDate: req.body.vaccineUpToDate,
      provider: req.body.provider,
      age: req.body.age,
      price: req.body.price,
      img: req.body.img,
      exist: true
    });
    Pet.collection.insertOne(pet, err => {
      if (err) {
        if (err.code === 11000) {
          return res.json({
            success: false,
            message: "A pet with that name has already existed!"
          });
        } else {
          res.send(err);
        }
      }
      res.json({
        message: "pet created!"
      });
    });
  })
  .get((req, res) => {
    Pet.find((err, pets) => {
      return res.json(pets);
    });
  });

apiRouterPet
  .route("/pets/:pet_id")
  .get((req, res) => {
    Pet.findById(req.params.pet_id).exec((err, pet) => {
      if (err) {
        res.send(err);
      } else {
        res.json(pet);
      }
    });
  })
  .put((req, res) => {
    Pet.findById(req.params.pet_id).exec((err, pet) => {
      if (err) {
        res.send(err);
      } else {
        if (req.body.name) {
          pet.name = req.body.name;
        }
        if (req.body.kind) {
          pet.kind = req.body.kind;
        }
        if (req.body.character) {
          pet.character = req.body.character;
        }
        if (req.body.gender) {
          pet.gender = req.body.gender;
        }
        if (req.body.vaccineUpToDate) {
          pet.vaccineUpToDate = req.body.vaccineUpToDate;
        }
        if (req.body.provider) {
          pet.provider = req.body.provider;
        }
        if (req.body.age) {
          pet.age = req.body.age;
        }
        if (req.body.price) {
          pet.price = req.body.price;
        }
        if (req.body.img) {
          pet.img = req.body.img;
        }
        Pet.updateOne({ _id: req.params.pet_id }, pet, err => {
          if (err) {
            res.send(err);
          } else {
            res.json({
              message: "Pet updated!"
            });
          }
        });
      }
    });
  })
  .delete((req, res) => {
    Pet.remove({ _id: req.params.pet_id }).exec((err, pet) => {
      if (err) {
        res.send(err);
      } else {
        res.json({
          message: "Delete successfully!"
        });
      }
    });
  });

apiRouterPet.route("/pets/search/:pet_name").get((req, res) => {
  Pet.find({ name: { $regex: req.params.pet_name, $options: "$i" } }).exec(
    (err, pet) => {
      if (err) {
        res.send(err);
      } else {
        res.json(pet);
      }
    }
  );
});

module.exports = apiRouterPet;
