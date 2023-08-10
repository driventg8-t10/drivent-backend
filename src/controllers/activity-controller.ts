import { AuthenticatedRequest } from "@/middlewares";
import activityService from "@/services/activity-service";
import { Request, Response } from "express";
import httpStatus from "http-status";

export async function getActivities(req: Request, res: Response) {

    const activities = await activityService.getActivities()

    return res.status(httpStatus.OK).send(activities);
}

export async function enrollOnActivity(req: AuthenticatedRequest, res: Response) {
    const { userId } = req;
    const { activityId } = req.body
    const enrollment = await activityService.enrollOnActivity(userId, activityId)

    return res.status(httpStatus.OK).send(enrollment)
}

export async function getActivityById(req: AuthenticatedRequest, res: Response) {
    const activityId  = parseInt(req.params.id)

    const activity = await activityService.getActivityById(activityId)

    return res.status(httpStatus.OK).send(activity)
}