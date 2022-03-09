import Bot from "../bot";
import { OnHandler } from "../handler";
import { UserTelegram } from "@abot/model";

export default {
  method: 'on',
  event: 'callback_query',
  callback: async (ctx, bot: Bot) => {
    const scenarioId = ctx.callbackQuery.data;
    const user = await bot.getUserWithActiveDemands(ctx.callbackQuery.from) as UserTelegram;
    const demandId = scenarioId + '/' + user.login;
    const { id } = await bot.apiClient.demands.create({
      id: demandId,
      title: demandId,
      description: '',
      scenario: scenarioId,
      sessionUser: user.id,
      isSessionUserIsAdmin: false,
      payload: {}
    });
    ctx.telegram.sendMessage(
      user.payload.telegramId,
      `Your demand (${id}) is created. Please send me a short text to accompany it.`
    );
  }
} as OnHandler;