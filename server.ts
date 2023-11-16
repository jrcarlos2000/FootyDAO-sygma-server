import express, { Express, Request, Response } from "express";
const cors = require("cors");
const dotenv = require("dotenv");
const cookieSession = require("cookie-session");
const bodyParser = require("body-parser");
const app = express();
import { db } from "./models";
import dbConfig from "./config/db.config";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import gameRoutes from "./routes/game.routes";
import web3Routes from "./routes/web3.routes"
dotenv.config();

var corsOptions = {
  origin: "https://footydao.xyz",
};

if (process.env.PRODUCTION == "TRUE") {
  app.use(cors(corsOptions));
}

app.use(bodyParser.json());

app.use(express.urlencoded({ extended: true }));

app.use(
  cookieSession({
    name: "footydao-session",
    secret: process.env.COOKIE_SECRET,
    httpOnly: true,
  })
);

// connect to db
const Role = db.role;
db.mongoose
  .connect(process.env.CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: dbConfig.NAME,
  })
  .then(() => {
    console.log("Successfully connect to MongoDB.");
    initial();
  })
  .catch((err: Error) => {
    console.error("Connection error", err);
    process.exit();
  });
function initial() {
  Role.estimatedDocumentCount((err: Error, count: Number) => {
    if (!err && count === 0) {
      new Role({
        name: "user",
      }).save();

      new Role({
        name: "admin",
      }).save();
    }
  });
}
// simple route
app.get("/", async (req: Request, res: Response) => {
  res.status(500).send({ message: "Welcome to FootyDAO." });
});

// Other routes

authRoutes(app);
userRoutes(app);
gameRoutes(app);
web3Routes(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
});
