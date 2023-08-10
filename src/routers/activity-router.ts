import { enrollOnActivity, getActivities, getActivityById } from "@/controllers/activity-controller";
import { authenticateToken, validateBody } from "@/middlewares";
import { activitySchema } from "@/schemas/activity-schemas";
import { Router } from "express";

const activityRouter = Router();

activityRouter.get("/", authenticateToken, getActivities);
activityRouter.post("/", authenticateToken, validateBody(activitySchema), enrollOnActivity)
activityRouter.get("/:id", authenticateToken, getActivityById)

export { activityRouter };