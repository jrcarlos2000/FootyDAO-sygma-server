import { Collection, Model, Schema } from "mongoose";
interface DB {
  mongoose: any;
  user: Model<any>;
  role: Model<any>;
  game: Model<any>;
  ROLES: string[];
}

export { DB };
