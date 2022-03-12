import {readFileSync} from "fs";
import { Telegraf } from 'telegraf';
import { TlsOptions } from 'tls'
import ApiClient, { APIError } from '@abot/api-client';
import { Config } from "@abot/config";
import * as tt from 'telegraf/typings/telegram-types';
import { InputFile, User } from "typegram";
import { UserTelegram } from "@abot/model";
import handlers from "./handlers";
import { JSONCodec, NatsConnection, connect } from 'nats';
import { MessageNotification } from "../../api/node_modules/@abot/api-contract/src/messages";
import { CommandHandler, Handler, OnHandler } from "./handler";

class Bot {
  private tlsOptions: TlsOptions | null = null;
  public apiClient: ApiClient;
  private token: string = undefined as unknown as string;
  private botPath: string = undefined as unknown as string;
  private botUrl: string = undefined as unknown as string;
  private webhookExtra: tt.ExtraSetWebhook = {};
  private botPort: number = undefined as unknown as number;
  private bot: Telegraf = undefined as unknown as Telegraf;
  private connection?: NatsConnection;
  private codec = JSONCodec();

  constructor(public config: Config) {
    this.apiClient = new ApiClient(config);
    this.initBot(config);
    this.bindBotEvents();
  }

  private initBot(config: Config) {
    this.token = config.telegram.bot_token as string;
    if (config.telegram.bot_key_file && config.telegram.bot_cert_file) {
      this.tlsOptions = {
        key: readFileSync(config.telegram.bot_key_file),
        cert: readFileSync(config.telegram.bot_cert_file)
      };
    }
    this.botPort = config.telegram.bot_port;
    this.botPath = '/' + this.token;
    let host = `https://${config.telegram.bot_host}:${this.botPort}`;
    if (config.telegram.bot_tunnel !== undefined) {
      host = config.telegram.bot_tunnel;
    }
    this.botUrl = `${host}${this.botPath}`;
    if (config.telegram.bot_cert_self_signed) {
      this.webhookExtra = { certificate: {source: this.tlsOptions.cert} as InputFile };
    }
    this.bot = new Telegraf(this.token);
  }

  private bindBotEvents() {
    for (const handler of handlers) {
      if (handler.method == 'on') {
        const h = <OnHandler> handler;
        this.bot.on(h.event, (ctx, next) => { h.callback(ctx, this, next) });
      } else if (handler.method == 'command') {
        const h = <CommandHandler> handler;
        this.bot.command(h.command, (ctx, next) => { h.callback(ctx, this, next) });
      } else {
        this.bot[handler.method]((ctx, next) => { handler.callback(ctx, this, next) });
      }
    }
  }

  public async getUserWithActiveDemands(user: User) {
    return await this.apiClient.user.telegram.get({
      login: user.username,
      telegramId: String(user.id) as string
    });
  }

  async start() {
    this.apiClient.start();
    this.connection = await connect({ servers: this.config.nats.uri });
    this.connection.closed().then(() => {
      this.connection = undefined;
    });
    this.subscribe();
    

    // eslint-disable-next-line
    (<any> this.bot).startWebhook(this.botPath, this.tlsOptions, this.botPort, '0.0.0.0');
    this.bot.telegram.setWebhook(this.botUrl, this.webhookExtra);
    
    // Enable graceful stop
    process.once('SIGINT', () => this.bot.stop('SIGINT'))
    process.once('SIGTERM', () => this.bot.stop('SIGTERM'))
  }

  private async subscribe() {
    if (this.connection == null) {
      throw new Error(`Not connected`);
    }

    for await (const message of this.connection.subscribe('messages.notify')) {
      const notification = this.codec.decode(message.data) as MessageNotification;
      for (const recipient of notification.recipients) {
        this.bot.telegram.sendMessage(
          recipient.payload.telegramId as string,
          `<b>Message about request ${notification.demand}</b>
          from ${notification.sender}\n\n${(<any> notification.payload).text}`,
          { parse_mode: 'HTML' }
        );
      }
      message.respond(
        this.codec.encode({
          code: 200
        }),
      );
    }
  }
};

export default Bot;
