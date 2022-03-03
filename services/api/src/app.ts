import { connect, JSONCodec, NatsConnection } from 'nats';

import { Config } from '@abot/config';
import DAO from '@abot/dao';
import { ApplicationError, Command } from './commands';
import commands from './commands/list';
import { SessionDao } from './sessions/client';

class Application {
  private codec = JSONCodec();
  private connection?: NatsConnection;
  public dao: DAO;
  public sessions: SessionDao;

  constructor (
    public config: Config
  ) { 
    this.dao = new DAO(config);
    this.sessions = new SessionDao(config);
  }

  async start () {
    this.connection = await connect({ servers: this.config.nats.uri });
    this.connection.closed().then(() => { this.connection = undefined });

    await this.sessions.start();
    
    await Promise.all(commands.map((command) => { this.subscribe(command) }))
  }

  async end () {
    if (this.connection == null) {
      throw new Error('Application was not started');
    }
    await this.dao.end();
    await this.sessions.end();

    await this.connection.close();
    this.connection = undefined;
  }

  async subscribe<Requset, Response>(command: Command<Requset, Response>) {
    if (this.connection == null) {
      throw new Error('Application was not started')
    }

    const subscribe = this.connection.subscribe(command.path);

    for await (const message of subscribe) {
      try {
        const response = await command.execute(this, this.codec.decode(message.data))
        message.respond(this.codec.encode({ 
          status: 'ok', 
          code: 200, 
          response
        }));
      } catch (e) {
        const appError = e as ApplicationError;
        if (appError.isApplicationError) {
          message.respond(this.codec.encode({ 
            status: 'error', 
            code: appError.code, 
            message: appError.message
          }));
          return;
        }

        console.error("Unhandled error:", e);
        message.respond(this.codec.encode({
          status: 'error',
          code: 500,
          message: "Unpredicted error!"
        }));
        return;

      }
    }
  }
}

export default Application;