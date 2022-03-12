import { UserWithActiveDemands } from "@abot/api-contract/target/user/telegram/index";
import Bot from "../bot";
import { CommandHandler } from "../handler";
import { ApplicationError } from "@abot/api/src/commands";
import { Message } from 'typegram/message'
import { User } from 'typegram/manage';

export default new CommandHandler(
  'command',
  'next',
  async (ctx, bot: Bot) => {
    const message = <Message.TextMessage> ctx.message;
    const user = await bot.getUserWithActiveDemands(message.from as User) as UserWithActiveDemands;
    if (user.demands.length > 0) {
      ctx.reply('You have an active request right now. Please complete it before serving the next.');
      return;
    }
    try {
      const demand = await bot.apiClient.demands.next({
        sessionUser: user.id,
        isSessionUserIsAdmin: user.isAdmin
      });
      ctx.reply(`Assign a new request (${demand.title}) to you.\n\nHere is the short description: ${demand.description}`);
    } catch (e) {
      const error = e as ApplicationError;
      if (error.code === 404) {
        ctx.reply('There are no requests right now. Please, check back later.');
      }
    }
  }
);