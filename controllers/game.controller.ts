import { db } from "../models";
import {
  MAX_NUMBER_OF_REGISTRATIONS,
  generatePlayerListPipeline,
  PLAYER_LIST_DATA_HEADERS,
} from "../utils/utils";
import moment from "moment";
import fs from "fs";
import { write } from "fast-csv";
import path from "path";

const User = db.user;
const Game = db.game;

export const addGame = (req: any, res: any) => {
  console.log(req);
  const game = new Game({
    description: req.body.description,
    profilePic: req.body.profilePic,
    title: req.body.title,
    maxParticipants: req.body.maxParticipants,
    city: req.body.city,
    country: req.body.country,
    date: req.body.date,
    startTime: req.body.startTime,
    endTime: req.body.endTime,
    location: req.body.location,
    locationLink: req.body.locationLink,
    format: req.body.format,
    web3Event: req.body.web3Event,
    stake: req.body.stake,
    totalStake: 0,
    pics: req.body.pics,
    videos: req.body.videos,
    sponsors: req.body.sponsors,
    onChainGameIndex : req.body.onChainGameIndex
  });
  game.save((err: any, game: any) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    res.send({ message: "added game successfully!" });
  });
};

export const getAllGames = (req: any, res: any) => {
  Game.find().exec((err: any, games: any) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    res.status(200).send(games);
  });
};

export const joinGame = (req: any, res: any) => {
  Game.findByIdAndUpdate(req.body.gameId).exec((err: any, game: any) => {
    if (req.body.amount > MAX_NUMBER_OF_REGISTRATIONS) {
      res.status(400).send("Max number of registrations exceeded");
      return;
    }

    if (game) {
      if (moment(game.date).isBefore(moment())) {
        res.status(400).send("Registrations have been closed");
        return;
      }
      User.findById(req.userId).exec((err: any, user: any) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
        if (!user.games.includes(game._id)) {
          user.games.push(game._id);
        }
        user.save((err: any) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }
        });
        var participants = [];
        for (let i = 0; i < req.body.amount; i++) {
          participants.push(user);
        }
        game.participants.push(
          ...participants.map((user: any) => user.username)
        );
        game.save((err: any) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }

          res.send({ message: "registered successfully!" });
        });
      });
    } else {
      res.status(400).send("Game Does Not Exist");
      return;
    }
  });
};

export const getGameById = (req: any, res: any) => {
  Game.findById(req.params.id).exec((err: any, game: any) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    res.status(200).send(game);
  });
};

export const getParticipants = (req: any, res: any) => {
  Game.aggregate(generatePlayerListPipeline(req.params.id)).exec(
    (err: any, participants: any) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      try {
        const filePath = path.join(__dirname, "participant_data.csv");

        const fileStream = fs.createWriteStream(filePath);

        const csvData = [];

        csvData.push(PLAYER_LIST_DATA_HEADERS);

        participants.forEach((participant: any) => {
          const rowData = [
            participant.username,
            participant.project,
            participant.location,
            participant.twitter,
            participant.telegram,
            participant.repetitions,
          ];

          csvData.push(rowData);
        });

        write(csvData, { headers: false }).pipe(fileStream);

        fileStream.on("finish", () => {
          res.setHeader(
            "Content-Disposition",
            "attachment; filename=participant_data.csv"
          );
          res.status(200);
          res.setHeader("Content-Type", "text/csv");
          res.sendFile(filePath, () => {
            fs.unlinkSync(filePath);
            return;
          });
        });
      } catch (err) {
        res.status(500).send({ message: err });
        return;
      }
    }
  );
};
