import { authJwt } from "../middlewares";
import * as controller from "../controllers/user.controller";

export default function (app: any) {
  app.use(function (req: any, res: any, next: any) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });

  app.get("/api/user/exist", controller.checkUserExist);

  app.get("/api/user/info", [authJwt.verifyToken], controller.userInfo);

  app.get("/api/test/all", controller.allAccess);

  app.get("/api/test/user", [authJwt.verifyToken], controller.userBoard);

  app.get(
    "/api/test/admin",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.adminBoard
  );
}
