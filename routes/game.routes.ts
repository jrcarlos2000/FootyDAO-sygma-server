import { authJwt } from "../middlewares";
import * as controller from "../controllers/game.controller";

export default function (app: any) {
  app.use(function (req: any, res: any, next: any) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });

  app.post(
    "/api/game/add",
    controller.addGame
  );

  app.post("/api/game/join", [authJwt.verifyToken], controller.joinGame);

  app.get("/api/game/all", controller.getAllGames);

  app.get("/api/game/:id", controller.getGameById);

  app.get(
    "/api/game/participants/:id",
    // [authJwt.verifyToken, authJwt.isAdmin], // TODO ADD REQUIREMENTS LATER
    controller.getParticipants
  );
}
