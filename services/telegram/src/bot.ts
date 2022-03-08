import {readFileSync} from "fs";
import { Telegraf } from 'telegraf';
import { TlsOptions } from 'tls'
import ApiClient, { APIError } from '@abot/api-client';
import { Config } from "@abot/config";
import * as tt from 'telegraf/typings/telegram-types';
import { InputFile, User } from "typegram";
import { UserTelegram } from "../../api/node_modules/@abot/model/target";

class Bot {
  private session: string;
  private tlsOptions: TlsOptions = null;
  private apiClient: ApiClient;
  private token: string;
  private botPath: string;
  private botUrl: string;
  private webhookExtra: tt.ExtraSetWebhook = {};
  private botPort: number;
  private bot: Telegraf;

  constructor(public config: Config) {
    this.session = config.sessions.admin_key;
    this.apiClient = new ApiClient(config);
    this.initBotOptions(config);
    this.initBot();
  }

  private initBotOptions(config: Config) {
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
  }

  private initBot() {
    this.bot = new Telegraf(this.token);
    this.bot.start((ctx) => ctx.reply('Welcome'));
    this.bot.help((ctx) => ctx.reply('Send me a sticker'));
    this.bot.on('inline_query', async ctx => {
      const scenarios = await this.apiClient.scenarios.search(
        {q: ctx.inlineQuery.query, limit: 10, offset: 0}
      );

      const results = scenarios.map((scenario, id) => ({
        id,
        type: 'article',
        title: scenario.id,
        description: scenario.description,
        input_message_content: {
          message_text: scenario.id
        },
        reply_markup: {
          inline_keyboard: [[{
            text: 'Create demand',
            callback_data: scenario.id
          }]]
        }
      }));
      ctx.answerInlineQuery(results);
    });
    this.bot.on('callback_query', async ctx => {
      const user = await this.getOrCreateUser(ctx.callbackQuery.from) as UserTelegram;
      const { id } = await this.apiClient.demands.create({
        title: ctx.callbackQuery.data + ' demand',
        description: '',
        scenario: ctx.callbackQuery.data,
        sessionUser: user.id,
        isSessionUserIsAdmin: false,
        payload: {}
      });
      ctx.telegram.sendMessage(
        user.payload.telegramId, 
        `Your demand (${id}) is created, someone will reach out to you soon`
      );
    });
    this.bot.command('demands', async ctx => {
      const user = await this.getOrCreateUser(ctx.message.from) as UserTelegram;
      // required: ['q', 'sessionUser', 'isSessionUserIsAdmin', 'limit', 'offset'],
      const results = await this.apiClient.demands.search({
        q: ctx.message.text.replace('/demands', '').trim(),
        sessionUser: user.id,
        isSessionUserIsAdmin: false,
        limit: 10,
        offset: 0,
        my: true
      });
      const message = results.map((demand, id) => {
        return `${id + 1}. ${demand.title} @ ${demand.date}`;
      }).join("\n");
      ctx.reply(message);
    });
  }

  private async getOrCreateUser(user: User) {
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
