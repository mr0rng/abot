import { JSONCodec, NatsConnection, connect } from 'nats';

import { Config } from '@abot/config';
import DAO from '@abot/dao';

import { ApplicationError, Command } from './commands';
import commands from './commands/list';
import SessionDAO from './sessions';
import APIClient from '@abot/api-client';

class Application {
  private codec = JSONCodec();
  private connection?: NatsConnection;
  public dao: DAO;
  public sessions: SessionDAO;
  public apiClient: APIClient;

  constructor(public config: Config) {
    this.dao = new DAO(config);
    this.sessions = new SessionDAO(config);
    this.apiClient = new APIClient(config);
  }

  async start() {
    this.connection = await connect({ servers: this.config.nats.uri });
    this.connection.closed().then(() => {
      this.connection = undefined;
      (<any> this.apiClient).connection = undefined;
    });
    (<any> this.apiClient).connection = this.connection;

    await this.sessions.start();

    await Promise.all(
      commands.map((command) => {
        this.subscribe(command);
      }),
    );
  }

  async end() {
    if (this.connection == null) {
      throw new Error('Application was not started');
    }
    await this.dao.end();
    await this.sessions.end();

    await this.connection.close();
    this.connection = undefined;
    (<any> this.apiClient).connection = undefined;
  }

  async subscribe<Requset, Response>(command: Command<Requset, Response>) {
    if (this.connection == null) {
      throw new Error('Application was not started');
    }

    for await (const message of this.connection.subscribe(command.path)) {
      command
        .execute(this, this.codec.decode(message.data))
        .then((response) => {
          message.respond(
            this.codec.encode({
              code: 200,
              response,
            }),
          );
        })
        .catch((e) => {
          const appError = e as ApplicationError;
          if (appError.isApplicationError) {
            message.respond(this.codec.encode({ code: appError.code, message: appError.message }));
            return;
          }

          // eslint-disable-next-line no-console
          console.error('Unhandled error:', e);
          message.respond(this.codec.encode({ code: 500, message: 'Unhandled error' }));
          return;
        });
    }
  }
}

export default Application;
