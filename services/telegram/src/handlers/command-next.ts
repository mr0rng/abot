import { UserWithActiveDemands } from "@abot/api-contract/target/user/telegram/index";
import Bot from "../bot";
import { CommandHandler } from "../handler";
import { ApplicationError } from "@abot/api/src/commands";

export default {
  method: 'command',
  command: 'next',
  callback: async (ctx, bot: Bot) => {
    const user = await bot.getUserWithActiveDemands(ctx.message.from) as UserWithActiveDemands;
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
} as CommandHandler;