import { Router } from "express";
import { gitHubSignIn } from "../controllers/oauth-controller";

const oAuthRouter = Router();

oAuthRouter.post("/github/login/:code", gitHubSignIn);

export { oAuthRouter };
