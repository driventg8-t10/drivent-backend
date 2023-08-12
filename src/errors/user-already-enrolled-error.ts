import { ApplicationError } from "@/protocols";

export function userAlreadyEnrolledError(): ApplicationError {
  return {
    name: "userAlreadyEnrolledError",
    message: "User is already enrolled on this activity",
  };
}