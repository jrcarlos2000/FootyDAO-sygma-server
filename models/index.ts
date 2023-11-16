import mongoose from "mongoose";
import { DB } from "../types";
import { Role } from "./role.model";
import { User } from "./user.model";
import { Game } from "./game.model";

mongoose.Promise = global.Promise;

export const db: DB = {
  mongoose,
  user: User,
  role: Role,
  game: Game,
  ROLES: ["user", "admin"],
};
