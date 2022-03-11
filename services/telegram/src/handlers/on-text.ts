import { ApplicationError } from "@abot/api/target/commands";
import Bot from "../bot";
import { OnHandler } from "../handler";
import { Message } from 'typegram/message'
import { User } from 'typegram/manage';

export default new OnHandler(
  'on',
  'text',
  async (ctx, bot: Bot) => {
    const message = <Message.TextMessage> ctx.message;
    if (message.via_bot && message.via_bot.username == 'abot_mxposed_test_bot') {
      return;
    }
    const { demands, ...user } = await bot.getUserWithActiveDemands(message.from as User);
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
          description: message.text,
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
          payload: { text: message.text }
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
        payload: { text: message.text }
      });
    }
  }
);