import Bot from "../bot";
import { OnHandler } from "../handler";
import { UserTelegram } from "@abot/model";
import { CallbackQuery } from "typegram/callback";
import { User } from "typegram/manage";

export default new OnHandler(
  'on',
  'callback_query',
  async (ctx, bot: Bot) => {
    const query = <CallbackQuery.DataCallbackQuery> ctx.callbackQuery;
    const scenarioId = query.data;
    const user = await bot.getUserWithActiveDemands(query.from as User) as UserTelegram;
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
);