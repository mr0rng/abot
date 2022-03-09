import { UserTelegram } from "@abot/model";
import Bot from "../bot";
import { CommandHandler } from "../handler";

export default {
  method: 'command',
  command: 'demands',
  callback: async (ctx, bot: Bot) => {
    const user = await bot.getOrCreateUser(ctx.message.from) as UserTelegram;
    const results = await bot.apiClient.demands.search({
      q: ctx.message.text.replace('/demands', '').trim(),
      sessionUser: user.id,
      isSessionUserIsAdmin: false,
      limit: 10,
      offset: 0,
      my: true
    });
    const message = results.map((demand, id) => {
      return `${id + 1}. ${demand.title} (${demand.status}) @ ${demand.date}`;
    }).join("\n");
    ctx.reply(message);
  }
} as CommandHandler;