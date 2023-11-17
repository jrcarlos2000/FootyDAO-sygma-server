import { verifySignUp } from "../middlewares";
import * as controller from "../controllers/web3.controller";

export default (app: any) => {
  app.use(function (req: any, res: any, next: any) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });
  app.post(
    "/api/web3/distribute-rewards/:userStringArray/:totalAmount/:fanTokenId",
    controller.distributeRewards
  );
  app.post("/api/web3/collect-money/:gameId", controller.collectMoneyFromGame);
};
