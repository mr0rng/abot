import { Handler } from "../handler";

const startMessage = 
`Hello. This is a bot to connect those who need with those who can provide.
Text /help for more information, or go and search for what you need by
typing the bot's @username and query in this chat`;

export default {
  method: 'start',
  callback: ctx => {
    ctx.reply(startMessage);
  }
} as Handler;
