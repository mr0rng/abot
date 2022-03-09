import { UserTelegram } from "@abot/model";
import { ApplicationError } from "@abot/api/target/commands";
import Bot from "../bot";
import { OnHandler } from "../handler";

export default {
  method: 'on',
  event: 'text',
  callback: async (ctx, bot: Bot) => {
    if (ctx.message.via_bot && ctx.message.via_bot.username == 'abot_mxposed_test_bot') {
      return;
    }
    const { demands, ...user } = await bot.getUserWithActiveDemands(ctx.message.from);
    if (demands.length === 0) {
      ctx.reply(
        `There is no active demand found for you. Create one by searching for services
           by typing the bot's @username followed by query.`
      );
      return;
    }
    if (demands.length > 1) {
      ctx.reply(
        `There is more than one active demand found for you. This should not happen.
           We'll fix this shortly.`
      );
      return;
    }
    const demand = demands[0];
    if (demand.role === 'recipient') {
      if (demand.description === '') {
        await bot.apiClient.demands.update({
          id: demand.id,
          description: ctx.message.text,
          sessionUser: user.id,
          isSessionUserIsAdmin: false
        });
        ctx.reply(
          `Thank you, the description was saved. Someone will be with you shortly.`
        );
        return;
      }
      try {
        const _ = await bot.apiClient.participants.get({
          demand: demand.id,
          type: 'donor'
        });
        await bot.apiClient.messages.send({
          demand: demand.id,
          author: user.id,
          type: 'telegram',
          payload: { text: ctx.message.text }
        });
      } catch (e) {
        const error = e as ApplicationError;
        if (error.code && error.code == 404) {
          ctx.reply(
            `Unfortunately, no one has picked up your request yet.`
          );
          return;
        }
        throw e;
      }
    }
    if (demand.role === 'donor') {
      await bot.apiClient.messages.send({
        demand: demand.id,
        author: user.id,
        type: 'telegram',
        payload: { text: ctx.message.text }
      });
    }
  }
} as OnHandler;