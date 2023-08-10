import { Request, Response } from "express";
import GitHubAuthService from "@/services/oauth-service/GitHub";
import httpStatus from "http-status";

export async function gitHubSignIn(req: Request, res: Response) {
  const { code } = req.params;
  const result = await GitHubAuthService.signIn(code);
  res.status(httpStatus.OK).json(result);
}
