import { badRequestError } from "@/errors/bad-request-error";
import userRepository from "@/repositories/user-repository";
import sessionRepository from "@/repositories/session-repository";
import axios from "axios";
import jwt from "jsonwebtoken";

import { randomUUID } from "crypto";
import { exclude } from "@/utils/prisma-utils";

async function signIn(code: string) {
  if (!code) {
    throw badRequestError();
  }

  const params = {
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    code,
  };

  const gitHubToken = await getGitHubAccessToken(params);
  const userResponse = await getUserGitHubInfo(gitHubToken);

  const userEmail = userResponse.login + "@github.com";

  const user = await userRepository.upsert({ email: userEmail, password: randomUUID() });
  const token = await createSession(user.id);

  return {
    user: exclude(user, "password"),
    token,
  };
}

async function getGitHubAccessToken(params: GitHubAcessTokenParams) {
  const GITHUB_TOKEN_URL = "https://github.com/login/oauth/access_token";
  const response = await axios.post<GitHubApiTokenResponse>(GITHUB_TOKEN_URL, null, {
    params,
    headers: {
      Accept: " application/json",
    },
  });

  return response.data.access_token;
}

async function getUserGitHubInfo(token: string) {
  const GITHUB_USER_URL = "https://api.github.com/user";
  const userResponse = await axios.get(GITHUB_USER_URL, {
    headers: {
      Authorization: `bearer ${token}`,
    },
  });

  return userResponse.data;
}

async function createSession(userId: number) {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET);
  await sessionRepository.create({
    token,
    userId,
  });

  return token;
}

type GitHubAcessTokenParams = {
  client_id: string;
  client_secret: string;
  code: string;
};

type GitHubApiTokenResponse = {
  access_token: string;
  scope: string;
  token_type: string;
};

const GitHubAuthService = {
  signIn,
};

export default GitHubAuthService;
