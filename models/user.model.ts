import mongoose from "mongoose";

export const User = mongoose.model(
  "User",
  new mongoose.Schema({
    username: String,
    password: String,
    roles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role",
      },
    ],
    games: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Game",
      },
    ],
    project: String,
    location: String,
    twitter: String,
    telegram: String,
    dateJoined: Date,
  })
);
