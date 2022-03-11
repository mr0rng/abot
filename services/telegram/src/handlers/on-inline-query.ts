import { InlineQuery, InlineQueryResultArticle } from "typegram/inline";
import Bot from "../bot";
import { OnHandler } from "../handler";

export default new OnHandler(
  'on',
  'inline_query',
  async (ctx, bot: Bot) => {
    const query = <InlineQuery> ctx.inlineQuery;
    const scenarios = await bot.apiClient.scenarios.search(
      {q: query.query, limit: 10, offset: 0}
    );

    const results = scenarios.map((scenario, id) => ({
      id: String(id),
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
    ctx.answerInlineQuery(results as InlineQueryResultArticle[]);
  }
);