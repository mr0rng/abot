import { connect, JSONCodec, NatsConnection } from 'nats';

import { Config } from '@abot/config';
import { ApplicationError, Command } from './commands';
import commands from './commands/list';

class Application {
  private codec = JSONCodec();
  private connection?: NatsConnection;

  constructor (
    public config: Config
  ) { }

  async start () {
    this.connection = await connect({ servers: this.config.nats });
    this.connection.closed().then(() => { this.connection = undefined });
    
    await Promise.all(commands.map((command) => this.subscribe(command)))
  }

  async stop () {
    if (this.connection == null) {
      throw new Error('Application was not started')
    }

    await this.connection.close();
    this.connection = undefined;
  }

  async subscribe<Requset, Response>(command: Command<Requset, Response>) {
    if (this.connection == null) {
      throw new Error('Application was not started')
    }
    
    const subscribe = this.connection.subscribe(command.path)
    for await (const message of subscribe) {
      try {
        const response = await command.expecute(this, this.codec.decode(message.data))
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
      }
    }
  }
}

export default Application;