import { connect, JSONCodec, NatsConnection } from "nats";

import { Config } from '@abot/config';
import ApiContract from '@abot/api-contract';

import APIClientDemands from './demands';
import APIClientMessages from './messages';
import APIClientScenarios from './scenarios';
import APIClientUser from './user';
import APIClientUsers from './users';

export default class APIClient implements ApiContract {
  private connection: NatsConnection | undefined;
  private codec = JSONCodec();

  public demands = new APIClientDemands(this);
  public messages = new APIClientMessages(this);
  public scenarios = new APIClientScenarios(this);
  public user = new APIClientUser(this);
  public users = new APIClientUsers(this);

  constructor (
    public config: Config
  ) { }

  async start () {
    if (this.connection != null) {
      throw new Error(`Already connected`);
    }

    this.connection = await connect({ servers: this.config.nats.uri });
  }

  async end () {
    if (this.connection == null) {
      throw new Error(`Not connected`)
    }

    await this.connection.close();
    this.connection = undefined;
  }

  async execute<Request, Response> (method: string, request: Request): Promise<Response> {
    if (this.connection == null) {
      throw new Error(`Not connected`)
    }

    const message = await this.connection.request(
      method,
      this.codec.encode(request)
    );

    return this.codec.decode(message.data) as Response;
  }
}