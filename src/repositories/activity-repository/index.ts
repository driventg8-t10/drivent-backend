import { prisma } from "@/config";

async function getActivities() {
  return prisma.activity.findMany({
    include: {
      ActivityEnrollment: true,
    },
  });
}

async function getActivitiesCountByUserId(userId: number) {
  return prisma.activityEnrollment.count({
    where: {
      userId: userId,
    },
  });
}

async function enrollOnActivity(userId: number, activityId: number) {
  return prisma.activityEnrollment.create({
    data: {
      activityId,
      userId,
    },
  });
}

async function getActivity(activityId: number) {
  return prisma.activity.findFirst({
    where: {
      id: activityId,
    },
    include: {
      ActivityEnrollment: true,
    },
  });
}

async function getActivityEnrollments(activityId: number) {
  return prisma.activityEnrollment.findMany({
    where: {
      activityId,
    },
    include: {
      Activity: true,
    },
  });
}

const activityRepository = {
  getActivities,
  enrollOnActivity,
  getActivityEnrollments,
  getActivity,
  getActivitiesCountByUserId,
};

export default activityRepository;
