import { ApplicationError } from "../protocols";

export function notEnoughActivitiesError(): ApplicationError {
  return {
    name: "NotEnoughActivitiesError",
    message: "You have not participated in at least 5 activities",
  };
}
