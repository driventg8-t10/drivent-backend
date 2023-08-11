import { notFoundError, unauthorizedError } from "@/errors";
import { ActivityFullError } from "@/errors/activity-full-error";
import { unpaidError } from "@/errors/unpaid-error";
import activityRepository from "@/repositories/activity-repository";
import ticketRepository from "@/repositories/ticket-repository";

async function getActivities() {
  const activities = await activityRepository.getActivities()
  if (!activities) {
    throw notFoundError();
  }

  return activities;
}

async function getActivityById(activityId: number) {
  const activity = await activityRepository.getActivity(activityId)

  if(!activity) throw notFoundError()

  return activity
}

async function enrollOnActivity(userId: number, activityId: number, ticketId: number) {
  const checkTicket = await ticketRepository.findTickeyById(ticketId)
  if (checkTicket.Enrollment.userId !== userId) throw unauthorizedError()
  if (checkTicket.status !== "PAID") throw unpaidError()

  const checkCapacity = await activityRepository.getActivity(activityId)
  if( checkCapacity.capacity <= checkCapacity.ActivityEnrollment.length) throw ActivityFullError()

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