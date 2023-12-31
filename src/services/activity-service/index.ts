import { conflictError, notFoundError, unauthorizedError } from "@/errors";
import isBetween from "dayjs/plugin/isBetween";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import { ActivityFullError } from "@/errors/activity-full-error";
import { ScheduleConflictError } from "@/errors/schedule-conflict-error";
import { unpaidError } from "@/errors/unpaid-error";
import { userAlreadyEnrolledError } from "@/errors/user-already-enrolled-error";
import activityRepository from "@/repositories/activity-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";
import dayjs from "dayjs";

dayjs.extend(isBetween);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore)

async function getActivities(date: string) {
  const activities = await activityRepository.getPlace(date)
  if (!activities) {
    throw notFoundError();
  }

  return activities;
}

async function getActivityById(activityId: number) {
  const activity = await activityRepository.getActivity(activityId)

  if (!activity) throw notFoundError()

  return activity
}

async function enrollOnActivity(userId: number, activityId: number) {
  const checkTicket = await enrollmentRepository.findEnrollmentByUserId(userId)

  if (checkTicket === null) throw unauthorizedError()
  if (!checkTicket.Ticket || checkTicket.Ticket.length === 0) throw unauthorizedError()
  if (checkTicket.Ticket[0].status !== "PAID") throw unpaidError()

  const newActivity = await activityRepository.getActivity(activityId)
  if (!newActivity) throw notFoundError()

  const isUserEnrolled = newActivity.ActivityEnrollment.some(
    enrollment => enrollment.userId === userId
  );

  if (isUserEnrolled) {
    throw userAlreadyEnrolledError()
  }

  if (newActivity.capacity <= newActivity.ActivityEnrollment.length) throw ActivityFullError()

  const newActivityStartTime = dayjs(newActivity.startDate);
  const newActivityEndTime = dayjs(newActivity.endDate);
  const existingActivity = await activityRepository.getEnrollmentByUserId(userId, newActivityStartTime, newActivityEndTime);
  if (existingActivity) {
    for (const activity of existingActivity) {
      console.log(activity)
      const existingActivityStartTime = dayjs(activity.startDate);
      const existingActivityEndTime = dayjs(activity.endDate);
      if (
        (newActivityStartTime.isSameOrAfter(existingActivityStartTime) && newActivityStartTime.isBefore(existingActivityEndTime)) ||
        (newActivityEndTime.isAfter(existingActivityStartTime) && newActivityEndTime.isSameOrBefore(existingActivityEndTime)) ||
        (newActivityStartTime.isBefore(existingActivityStartTime) && newActivityEndTime.isAfter(existingActivityEndTime))
      ) {
        throw ScheduleConflictError();
      }
    }

  }
  const enrollment = await activityRepository.enrollOnActivity(userId, activityId)

  return enrollment
}

export type activityBody = {
  activityId: number
}

const activityService = {
  getActivities,
  enrollOnActivity,
  getActivityById
};

export default activityService