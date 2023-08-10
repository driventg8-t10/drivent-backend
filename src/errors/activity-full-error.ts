import { ApplicationError } from "@/protocols";

export function ActivityFullError(): ApplicationError {
  return {
    name: "ActivityFullError",
    message: "Cannot enroll on this Activity! Overcapacity!",
  };
}