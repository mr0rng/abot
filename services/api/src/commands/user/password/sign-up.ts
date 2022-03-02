import Application from '../../../app';
import { Command } from '../..'

export default new Command<Request, Response>(
  "user/password/sign-up",
  async (app: Application, request: Request): Promise<Response> => {
    return {} as Response; 
  },
  {
    type: "object",
    properties: {
      login: {type: "string"},
      hash: {type: "string"},
    },
    required: ["login", "hash"],
    additionalProperties: false
  }
)

export type Request = {
  login: string,
  hash: string
};

export type Response = {

};