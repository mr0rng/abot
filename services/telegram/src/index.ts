import config from '@abot/config';
import { Telegraf } from 'telegraf';
import ApiClient from '@abot/api-client';


const apiClient = new ApiClient(config);
const bot = new Telegraf(config.telegram.bot_token)
bot.start((ctx) => ctx.reply('Welcome'))
bot.help((ctx) => ctx.reply('Send me a sticker'))
bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
