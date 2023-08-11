import { prisma } from "@/config";
import dayjs from "dayjs";

async function getActivities() {
  return prisma.activity.findMany({
    include: {
      ActivityEnrollment: true
    }
  })
}

async function enrollOnActivity(userId: number, activityId: number) {
  return prisma.activityEnrollment.create({
    data: {
      activityId,
      userId
    }
  })
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
          ActivityEnrollment: {
            select: {
              id: true
            }
          }
        }
      }
    },
  });
}

async function getActivity(activityId: number) {
  return prisma.activity.findFirst({
    where: {
      id: activityId
    },
    include: {
      ActivityEnrollment: true
    }
  })
}

async function getByDate(date: string) {
  const specificDate = new Date(date); // Data específica que você deseja buscar

// Configure o início do dia específico
const startDate = new Date(specificDate);
startDate.setHours(0, 0, 0, 0);

// Configure o término do dia seguinte ao específico
const endDate = new Date(specificDate);
endDate.setDate(endDate.getDate() + 1);
endDate.setHours(0, 0, 0, 0);

const activitiesOnSpecificDate = await prisma.activity.findMany({
  where: {
    startDate: {
      gte: startDate,
      lt: endDate,
    },
  },
});
}



async function getActivityEnrollments(activityId:number) {
  return prisma.activityEnrollment.findMany({
    where: {
      activityId
    },
    include: {
      Activity: true
    }
  })
}

const activityRepository = {
  getActivities,
  enrollOnActivity,
  getActivityEnrollments,
  getActivity,
  getPlace
}

export default activityRepository