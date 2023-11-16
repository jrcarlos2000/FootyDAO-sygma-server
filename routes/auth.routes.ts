import { verifySignUp } from "../middlewares";
import * as controller from "../controllers/auth.controller";

export default (app: any) => {
  app.use(function (req: any, res: any, next: any) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });

  app.post(
    "/api/auth/signup",
    [verifySignUp.checkDuplicateUsername, verifySignUp.checkRolesExisted],
    controller.signup
  );

  app.post("/api/auth/signin", controller.signin);

  app.post("/api/auth/signout", controller.signout);
};
