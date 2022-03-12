import { UserTelegram } from "@abot/model";
import Bot from "../bot";
import { CommandHandler } from "../handler";
import { Message } from 'typegram/message'
import { User } from 'typegram/manage';

export default new CommandHandler(
  'command',
  'demands',
  async (ctx, bot: Bot) => {
    const message = <Message.TextMessage> ctx.message;
    const user = await bot.getUserWithActiveDemands(message.from as User) as UserTelegram;
    const results = await bot.apiClient.demands.search({
      q: message.text.replace('/demands', '').trim(),
      sessionUser: user.id,
      isSessionUserIsAdmin: false,
      limit: 10,
      offset: 0,
      my: true
    });
    let reply = results.map((demand, id) => {
      return `${id + 1}. ${demand.title} (${demand.status}) @ ${demand.date}`;
    }).join("\n");
    if (reply == '') {
      reply = 'You have no demands yet.';
    }
    ctx.reply(reply);
  }
);