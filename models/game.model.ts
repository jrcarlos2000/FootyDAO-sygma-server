import { kStringMaxLength } from "buffer";
import mongoose from "mongoose";

export const Game = mongoose.model(
  "Game",
  new mongoose.Schema({
    description: String,
    profilePic: String,
    title: String,
    participants: [
      {
        type: String,
        ref: "User",
      },
    ],
    maxParticipants: Number,
    city: String,
    country: String,
    date: String,
    startTime: String,
    endTime: String,
    location: String,
    locationLink: String,
    format: Number,
    web3Event: String,
    stake: Number,
    totalStake: Number,
    pics: [String],
    videos: [String],
    sponsors: [String],
    onChainGameIndex: Number
  })
);
