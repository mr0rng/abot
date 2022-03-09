import {readFileSync} from "fs";
import { Telegraf } from 'telegraf';
import { TlsOptions } from 'tls'
import ApiClient, { APIError } from '@abot/api-client';
import { Config } from "@abot/config";
import * as tt from 'telegraf/typings/telegram-types';
import { InputFile, User } from "typegram";
import { UserTelegram } from "@abot/model";
import handlers from "./handlers";

class Bot {
  private tlsOptions: TlsOptions = null;
  public apiClient: ApiClient;
  private token: string;
  private botPath: string;
  private botUrl: string;
  private webhookExtra: tt.ExtraSetWebhook = {};
  private botPort: number;
  private bot: Telegraf;

  constructor(public config: Config) {
    this.apiClient = new ApiClient(config);
    this.initBot(config);
    this.bindBotEvents();
  }

  private initBot(config: Config) {
    this.token = config.telegram.bot_token;
    // this.tlsOptions = {
    //   key: readFileSync(config.telegram.bot_key_file),
    //   cert: readFileSync(config.telegram.bot_cert_file)
    // };
    this.botPort = config.telegram.bot_port;
    this.botPath = '/' + this.token;
    let host = `https://${config.telegram.bot_host}:${this.botPort}`;
    if (config.telegram.bot_tunnel !== undefined) {
      host = config.telegram.bot_tunnel;
    }
    this.botUrl = `${host}${this.botPath}`;
    // this.webhookExtra = {certificate: {source: this.tlsOptions.cert} as InputFile};
    this.bot = new Telegraf(this.token);
  }

  private bindBotEvents() {
    handlers.forEach(handler => {
      if (handler.method == 'on') {
        this.bot.on(handler.event, (ctx, next) => { handler.callback(ctx, this, next) });
      } else if (handler.method == 'command') {
        this.bot.command(handler.command, (ctx, next) => { handler.callback(ctx, this, next) });
      } else {
        this.bot[handler.method]((ctx, next) => { handler.callback(ctx, this, next) });
      }
    });
  }

  public async getOrCreateUser(user: User) {
    try {
      return await this.apiClient.user.telegram.get({telegramId: String(user.id)});
    } catch (e) {
      const error = e as APIError;
      if (error.code == 404) {
        return await this.apiClient.user.telegram.signUp({
          login: user.username,
          telegramId: String(user.id)
        });
      }

      throw e;
    }
  }

  start() {
    this.apiClient.start();
    // eslint-disable-next-line
    (<any> this.bot).startWebhook(this.botPath, this.tlsOptions, this.botPort, '0.0.0.0');
    this.bot.telegram.setWebhook(this.botUrl, this.webhookExtra);
    
    // Enable graceful stop
    process.once('SIGINT', () => this.bot.stop('SIGINT'))
    process.once('SIGTERM', () => this.bot.stop('SIGTERM'))
  }
};

export default Bot;
