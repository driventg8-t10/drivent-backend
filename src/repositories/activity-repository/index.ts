import { prisma } from "@/config";
import dayjs from "dayjs";

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

async function getPlace(date: string) {
  const dayjsdate = dayjs(date);

  const specificDate = dayjsdate;

  const startDate = specificDate.startOf('day');

  const endDate = specificDate.add(1, 'day').startOf('day');

  return await prisma.place.findMany({
    include: {
      Activity: {
        where: {
          startDate: {
            gte: startDate.toDate(),
            lt: endDate.toDate()
          }
        },
        include: {
          ActivityEnrollment: true
        }
      }
    },
  });
}

async function getActivity(activityId: number) {
  return prisma.activity.findFirst({
    where: {
      id: activityId,
    },
    include: {
      ActivityEnrollment: true
    },
  });
}

async function getEnrollmentByUserId(userId: number) {
  return prisma.activity.findFirst({
    include: {
      ActivityEnrollment: {
        where: {
          userId
        }
      }
    }
  })
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
  getPlace,
  getActivitiesCountByUserId,
  getEnrollmentByUserId
}
