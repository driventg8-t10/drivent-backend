import { enrollOnActivity, getActivities, getActivityById } from "@/controllers/activity-controller";
import { authenticateToken, handleApplicationErrors, validateBody } from "@/middlewares";
import { activitySchema } from "@/schemas/activity-schemas";
import { Router } from "express";

const activityRouter = Router();

activityRouter.get("/:date", authenticateToken, getActivities, handleApplicationErrors);
activityRouter.post("/", authenticateToken, validateBody(activitySchema), enrollOnActivity, handleApplicationErrors)
activityRouter.get("/:id", authenticateToken, getActivityById, handleApplicationErrors)

export { activityRouter };