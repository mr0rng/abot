import { Response } from "../../response";

export type ApiContractUserPassword = {
  signUp: (request: PasswordSignUpInRequest) => Promise<Response<PasswordSignUpInResponse>>,
  signIn: (request: PasswordSignUpInRequest) => Promise<Response<PasswordSignUpInResponse>>
};

export type PasswordSignUpInRequest = {
  type: string,
  login: string,
  passwordHash: string
};

export type PasswordSignUpInResponse = {
  session: string
};