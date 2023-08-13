import { ApplicationError } from "@/protocols";

export function ScheduleConflictError(): ApplicationError {
  return {
    name: "ScheduleConflictError",
    message: "User is already enrolled on an activity at this time",
  };
}
