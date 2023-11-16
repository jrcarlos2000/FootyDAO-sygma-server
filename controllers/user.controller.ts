import { db } from "../models";

const User = db.user;
const Game = db.game;
const Role = db.role;

export const allAccess = (req: any, res: any) => {
  res.status(200).send("Public Content.");
};

export const userBoard = (req: any, res: any) => {
  res.status(200).send("User Content.");
};

export const adminBoard = (req: any, res: any) => {
  res.status(200).send("Admin Content.");
};

export const checkUserExist = (req: any, res: any) => {
  User.findOne({
    username: {
      $regex: new RegExp("^" + req.body.username + "$", "i"),
    },
  }).exec((err: any, user: any) => {
    if (user) {
      res.status(200).send("User Already Exists");
      return;
    } else {
      res.status(200).send("User Does Not Exist");
      return;
    }
  });
};

export const userInfo = (req: any, res: any) => {
  User.findById(req.userId)
    .populate("games", "title description date time city country profilePic")
    .exec((err: any, user: any) => {
      if (user) {
        user.password = undefined;
        res.status(200).send(user);
        return;
      } else {
        res.status(400).send("User Does Not Exist");
        return;
      }
    });
};
