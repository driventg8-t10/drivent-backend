/* eslint-disable boundaries/element-types */
import { DEFAULT_EXP, redis } from "@/config";
import { notFoundError } from "@/errors";
import eventRepository from "@/repositories/event-repository";
import { exclude } from "@/utils/prisma-utils";
import { Event } from "@prisma/client";
import dayjs from "dayjs";

async function getFirstEvent() {
  const cachedEvent = await redis.get("cachedFirstEvent");
  if (cachedEvent) {
    return exclude(JSON.parse(cachedEvent), "createdAt", "updatedAt");
  }
  else {
    const event = await eventRepository.findFirst();
    redis.setEx("cachedFirstEvent", DEFAULT_EXP, JSON.stringify(event));
    if (!event) throw notFoundError();

    return exclude(event, "createdAt", "updatedAt");
  }
}

export type GetFirstEventResult = Omit<Event, "createdAt" | "updatedAt">;

async function isCurrentEventActive(): Promise<boolean> {
  const cachedEvent = await redis.get("cachedEvent");

  if (cachedEvent !== null && cachedEvent !== "null") {
    const parsedEvent = JSON.parse(cachedEvent);
    const now = dayjs();
    const eventStartsAt = dayjs(parsedEvent.startsAt);
    const eventEndsAt = dayjs(parsedEvent.endsAt);
    return now.isAfter(eventStartsAt) && now.isBefore(eventEndsAt);
  } else {
    const event = await eventRepository.findFirst();
    redis.setEx("cachedEvent", DEFAULT_EXP, JSON.stringify(event));
    if (!event) return false;

    const now = dayjs();
    const eventStartsAt = dayjs(event.startsAt);
    const eventEndsAt = dayjs(event.endsAt);
    return now.isAfter(eventStartsAt) && now.isBefore(eventEndsAt);
  }
}

const eventsService = {
  getFirstEvent,
  isCurrentEventActive,
};

export default eventsService;
