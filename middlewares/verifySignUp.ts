import { NextFunction, Request, Response } from "express";
import { db } from "../models";
import { Schema } from "mongoose";

const ROLES = db.ROLES;
const User = db.user;

export const checkDuplicateUsername = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Username
  User.findOne(
    {
      username: {
        $regex: new RegExp("^" + req.body.username + "$", "i"),
      },
    },

    function (err: Error, user: Schema) {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      if (user) {
        res
          .status(400)
          .send({ message: "Failed! Username is already in use!" });
        return;
      }
      next();
    }
  );
};

export const checkRolesExisted = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.body.roles) {
    for (let i = 0; i < req.body.roles.length; i++) {
      if (!ROLES.includes(req.body.roles[i])) {
        res.status(400).send({
          message: `Failed! Role ${req.body.roles[i]} does not exist!`,
        });
        return;
      }
    }
  }

  next();
};
