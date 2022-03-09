import { JSONCodec, NatsConnection, connect } from 'nats';

import ApiContract, { Response, ResponseError, ResponseOk } from '@abot/api-contract';
import { Config } from '@abot/config';

import APIClientDemands from './demands';
import APIClientMessages from './messages';
import APIClientScenarios from './scenarios';
import APIClientParticipants from './participants';
import APIClientUser from './user';
import APIClientUsers from './users';

export default class APIClient implements ApiContract {
  private connection: NatsConnection | undefined;
  private codec = JSONCodec();

  public demands = new APIClientDemands(this);
  public messages = new APIClientMessages(this);
  public scenarios = new APIClientScenarios(this);
  public participants = new APIClientParticipants(this);
  public user = new APIClientUser(this);
  public users = new APIClientUsers(this);

  constructor(public config: Config) {}

  async start() {
    if (this.connection != null) {
      throw new Error(`Already connected`);
    }

    this.connection = await connect({ servers: this.config.nats.uri });
  }

  async end() {
    if (this.connection == null) {
      throw new Error(`Not connected`);
    }

    await this.connection.close();
    this.connection = undefined;
  }

  async execute<Request, T>(method: string, request: Request): Promise<T> {
    if (this.connection == null) {
      throw new Error(`Not connected`);
    }

    const message = await this.connection.request(method, this.codec.encode(request));
    const response = this.codec.decode(message.data) as Response<T>;

    if (response.code !== 200) {
      throw new APIError(response.code, (response as ResponseError).message);
    }

    return (response as ResponseOk<T>).response;
  }
}

export class APIError extends Error {
  public code: number;

  constructor(code: number, message: string) {
    super(message);

    this.code = code;
  }
}
