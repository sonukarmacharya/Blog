const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const Blog = require("../models/blog");
const uModel = require("../models/Users");

if (typeof localStorage == "undefined" || localStorage == null) {
  const LocalStoraage = require("node-localstorage").LocalStorage;
  localStorage = new LocalStoraage("./scratch");
}

function checkLoginUser(req, res, next) {
  var userToken = localStorage.getItem("userToken");
  try {
    var decoder = jwt.verify(userToken, "loginToken");
    if (decoder) return res.status(200).json({ message: "already loggedin" });

    return res.status(400).json({ message: "not loggedin" });
  } catch (err) {
    res.status(400).json(err.message);
  }
}
router.post("/login", function (req, res) {
  var email = req.body.email;
  var pass = req.body.pass;
  var checkUname = uModel.findOne({ email: email });
  checkUname.exec((err, data) => {
    try {
      if (err) throw err;
      var getId = data._id;
      var getPass = data.password;
      if (bcrypt.compare(pass, getPass)) {
        var token = jwt.sign({ userId: getId }, "loginToken");
        localStorage.setItem("userToken", token);
        res.status(200).json({ message: "loggedin", token });
      } else {
        res.status(400).json({ message: "error" });
      }
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });
});

router.get("/login", function (req, res, next) {
  var userToken = localStorage.getItem("userToken");
  console.table(userToken);
  if (userToken) {
    res.status(200).json({ message: "dash", userToken });
  } else {
    res.status(400).json({ message: "login" });
  }
});

router.post("/signup", checkLoginUser, function (req, res, next) {
  var user = req.body.uname;
  var checkExistuser = uModel.findOne({ username: user });
  checkExistuser.exec((err, data) => {
    if (data)
      return res.status(400).json({
        msg: "Username already exist",
      });
    else {
      var username = req.body.uname;
      var email = req.body.email;
      var pass = req.body.pass;
      var cpass = req.body.cpass;
      if (pass != cpass) {
        res.status(400).json({ msg: "password not match" });
      } else {
        const salt = bcrypt.genSaltSync(10);
        const passHash = bcrypt.hashSync(pass, salt);
        var userDetail = new uModel({
          username: username,
          email: email,
          password: passHash,
        });
        userDetail.save(function (err, data) {
          if (err) throw err;
          res.status(400).json({
            msg: "Registered successfully",
            data,
          });
        });
      }
    }
  });
});

router.get("/dash", (req, res) => {
  var userToken = localStorage.getItem("userToken");

  Blog.find({})
    .then((result) =>
      res.status(200).json({ message: "Detail display", list: result })
    )
    .catch((err) => {
      res.status(400).json({ message: "Error", list: "" });
    });
});

router.post("/add", (req, res) => {
  const data = req.body;
  const blog = new Blog(data);
  blog.save((err) => {
    if (err) return res.status(400).json({ message: "Error saving" });
    return res.status(200).json({ message: "Saved" });
  });
});

router.delete("/delete/:id", (req, res) => {
  Blog.findById(req.params.id)
    .then((data) =>
      data.remove().then(() => res.json({ message: "deleted", list: data }))
    )
    .catch((err) => res.json({ message: "Error deleting" }));
});

router.put("/edit/:id", (req, res) => {
  Blog.findById(req.params.id)
    .then((data) => {
      data.title = req.body.title;
      data.body = req.body.body;

      data
        .save()
        .then(() => res.json({ message: "updated" }))
        .catch((err) => res.status(400).json(err));
    })
    .catch((err) => console.log(err));
});

router.get("/:id", (req, res) => {
  Blog.findById(req.params.id)
    .then((data) => {
      res.json({ status: 200, list: data });
    })
    .catch((err) => {
      console.log(err);
      res.json({ status: 400, message: "Error" });
    });
});

module.exports = router;
