import { activityBody } from "@/services/activity-service";
import Joi from "joi";

export const activitySchema = Joi.object<activityBody>({
  activityId: Joi.number().required(),
});
