import { Router } from "express";
import { authenticateToken } from "../middlewares";
import { getCertificate } from "../controllers";

const certificateRouter = Router();

certificateRouter.all("/*", authenticateToken).get("/", getCertificate);

export { certificateRouter };
