import { ApplicationError } from "@/protocols";

export function unpaidError(): ApplicationError {
  return {
    name: "unpaidError",
    message: "You must pay ticket to continue",
  };
}