import {readFileSync} from "fs";
import { Telegraf } from 'telegraf';
import { TlsOptions } from 'tls'
import ApiClient from '@abot/api-client';
import { Config } from "@abot/config";
import SessionDAO from "@abot/api/target/sessions";
import * as tt from 'telegraf/typings/telegram-types';
import { InputFile } from "typegram";


class Bot {
  private sessions: SessionDAO;
  private tlsOptions: TlsOptions;
  private apiClient: ApiClient;
  private token: string;
  private botPath: string;
  private botUrl: string;
  private webhookExtra: tt.ExtraSetWebhook;
  private botPort: number;
  private bot: Telegraf;

  constructor(public config: Config) {
    this.apiClient = new ApiClient(config);
    this.sessions = new SessionDAO(config);
    this.initBotOptions(config);
    this.initBot();
  }

  private initBotOptions(config: Config) {
    this.token = config.telegram.bot_token;
    this.tlsOptions = {
      key: readFileSync(config.telegram.bot_key_file),
      cert: readFileSync(config.telegram.bot_cert_file)
    };
    this.botPort = config.telegram.bot_port;
    this.botPath = '/' + this.token;
    this.botUrl = `https://${config.telegram.bot_host}:${this.botPort}${this.botPath}`;
    this.webhookExtra = {certificate: {source: this.tlsOptions.cert} as InputFile};
  }

  private initBot() {
    this.bot = new Telegraf(this.token);
    this.bot.start((ctx) => ctx.reply('Welcome'));
    this.bot.help((ctx) => ctx.reply('Send me a sticker'));
  }

  start() {
    (<any> this.bot).startWebhook(this.botPath, this.tlsOptions, this.botPort, '0.0.0.0');
    this.bot.telegram.setWebhook(this.botUrl, this.webhookExtra);
    
    // Enable graceful stop
    process.once('SIGINT', () => this.bot.stop('SIGINT'))
    process.once('SIGTERM', () => this.bot.stop('SIGTERM'))
  }
};

export default Bot;
