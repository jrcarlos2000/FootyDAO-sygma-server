import config from "../config/auth.config";
import { db } from "../models";

const User = db.user;
const Role = db.role;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

export const signup = (req: any, res: any) => {
  const user = new User({
    username: req.body.username,
    password: bcrypt.hashSync(req.body.password, 8),
    project: req.body.project || "",
    location: req.body.location || "",
    twitter: req.body.twitter || "",
    telegram: req.body.telegram || "",
    dateJoined: new Date(),
  });

  user.save((err: any, user: any) => {
    if (err) {
      res.status(500).send({ message: err });
      console.log(err);
      return;
    }
    Role.findOne({ name: "user" }, (err: any, role: any) => {
      if (err) {
        res.status(500).send({ message: err });
        console.log(err);
        return;
      }

      user.roles = [role._id];
      user.save((err: any) => {
        if (err) {
          res.status(500).send({ message: err });
          console.log(err);

          return;
        }

        res.send({ message: "registered successfully!" });
      });
    });
  });
};

export const signin = (req: any, res: any) => {
  User.findOne({
    username: {
      $regex: new RegExp("^" + req.body.username + "$", "i"),
    },
  })
    .populate("roles", "-__v")
    .exec((err: any, user: any) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({ message: "Invalid Password!" });
      }

      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400, // 24 hours
      });

      var authorities = [];

      for (let i = 0; i < user.roles.length; i++) {
        authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
      }

      req.session.token = token;

      res.status(200).send({
        id: user._id,
        username: user.username,
        roles: authorities,
      });
    });
};

export const signout = async (req: any, res: any) => {
  try {
    req.session = null;
    return res.status(200).send({ message: "You've been signed out!" });
  } catch (err) {
    return res.status(400).send({ message: "Failed to signed out!" });
  }
};
