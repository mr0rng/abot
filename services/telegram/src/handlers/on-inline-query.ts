import Bot from "../bot";
import { OnHandler } from "../handler";

export default {
  method: 'on',
  event: 'inline_query',
  callback: async (ctx, bot: Bot) => {
    const scenarios = await bot.apiClient.scenarios.search(
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
  }
} as OnHandler;